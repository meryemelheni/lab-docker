# 🚀 Déploiement TaskFlow sur K3s

Ce guide explique comment déployer l'application **TaskFlow** sur un cluster **K3s**,
à partir du projet Docker Compose existant.

---

## 🏗️ Architecture déployée

```
                  ┌────────────────────────────────────────┐
                  │   Cluster K3s  (namespace: taskflow)   │
                  │                                        │
  Browser ──80──▶ │  Traefik Ingress (intégré K3s)        │
                  │       │                                │
                  │       ▼                                │
                  │  frontend-service:80                   │
                  │  (nginx + build React)                 │
                  │       │ /api/*                         │
                  │       ▼                                │
                  │  backend-service:3000                  │
                  │  (Node.js Express)                     │
                  │       │                                │
                  │       ▼                                │
                  │  database-service:5432                 │
                  │  (PostgreSQL + PVC 1Gi)                │
                  └────────────────────────────────────────┘
```

---

## 📋 Prérequis

| Outil | Version recommandée | Vérification |
|-------|---------------------|--------------|
| K3s   | ≥ v1.28             | `k3s --version` |
| kubectl | ≥ v1.28           | `kubectl version --client` |
| Docker | ≥ 24.0            | `docker --version` |

> **Note** : Docker est nécessaire uniquement pour **builder les images** sur le nœud K3s.
> K3s utilise containerd comme runtime, les images sont importées via `k3s ctr images import`.

---

## 🚀 Déploiement rapide (script automatisé)

```bash
# 1. Cloner ou se positionner dans le projet
cd lab-docker-compose

# 2. Rendre le script exécutable
chmod +x k8s/deploy-k3s.sh

# 3. Lancer le déploiement complet
bash k8s/deploy-k3s.sh
```

Le script effectue automatiquement :
1. Build des images `taskflow-backend` et `taskflow-frontend`
2. Import des images dans K3s (containerd)
3. Application de tous les manifests Kubernetes
4. Attente du démarrage des pods
5. Affichage du statut et de l'URL d'accès

---

## 🔧 Déploiement manuel (étape par étape)

### Étape 1 — Builder les images Docker

```bash
# Backend
docker build -t taskflow-backend:latest ./backend

# Frontend (avec l'URL de l'API relative pour fonctionner sur n'importe quel domaine/IP)
docker build -t taskflow-frontend:latest \
  --build-arg VITE_API_URL=/api \
  -f ./frontend/Dockerfile .
```

### Étape 2 — Importer les images dans K3s (containerd)

```bash
docker save taskflow-backend:latest  | sudo k3s ctr images import -
docker save taskflow-frontend:latest | sudo k3s ctr images import -

# Vérifier que les images sont bien importées
sudo k3s ctr images list | grep taskflow
```

### Étape 3 — Appliquer les manifests Kubernetes

```bash
kubectl apply -k k8s/
```

### Étape 4 — Vérifier le déploiement

```bash
# Surveiller le démarrage des pods (attendre Status = Running)
kubectl get pods -n taskflow -w

# Vérifier les services
kubectl get svc -n taskflow

# Vérifier l'ingress Traefik
kubectl get ingress -n taskflow
```

---

## 🌍 Accès à l'application

Une fois tous les pods en état `Running` :

```bash
# Récupérer l'IP du nœud K3s
kubectl get nodes -o wide

# Accès dans le navigateur
http://<IP_DU_NOEUD>/          # Interface web TaskFlow
http://<IP_DU_NOEUD>/api/tasks # API REST (liste des tâches)
http://<IP_DU_NOEUD>/health    # Health check du backend
```

---

## 🔍 Commandes de débogage

```bash
# Voir les logs du backend
kubectl logs -l app=backend -n taskflow

# Voir les logs de la base de données
kubectl logs -l app=database -n taskflow

# Décrire un pod en erreur
kubectl describe pod <nom-du-pod> -n taskflow

# Exécuter une commande dans un pod
kubectl exec -it <nom-du-pod> -n taskflow -- /bin/sh

# Voir tous les événements du namespace
kubectl get events -n taskflow --sort-by='.lastTimestamp'

# Supprimer tout le déploiement
kubectl delete namespace taskflow
```

---

## 📁 Structure des manifests K8s

| Fichier | Description |
|---------|-------------|
| `namespace.yaml` | Namespace `taskflow` |
| `db-config.yaml` | ConfigMap + Secret pour PostgreSQL |
| `db-init-configmap.yaml` | Script SQL d'initialisation (tables + données) |
| `db-pvc.yaml` | PersistentVolumeClaim 1Gi (provisioning automatique K3s) |
| `db-deployment.yaml` | Deployment + Service PostgreSQL |
| `backend-deployment.yaml` | Deployment + Service Node.js (port 3000) |
| `frontend-configmap.yaml` | Config nginx avec proxy `/api/` → backend |
| `frontend-deployment.yaml` | Deployment + Service (LoadBalancer port 80) |
| `ingress.yaml` | Ingress Traefik → frontend-service |
| `kustomization.yaml` | Orchestration de l'ordre d'application |
| `deploy-k3s.sh` | Script de déploiement automatisé |

---

## ❓ Différences avec Docker Compose

| Aspect | Docker Compose | K3s |
|--------|----------------|-----|
| Réseau | Networks nommés | Services DNS natifs (`database-service`) |
| Volumes | Named volumes | PersistentVolumeClaim |
| Exposition | `ports: 8080:80` | Ingress Traefik |
| Images locales | Build automatique | Import via `k3s ctr images import` |
| Health checks | `healthcheck:` | `readinessProbe:` |
| Dépendances | `depends_on:` | `readinessProbe` + ordre Kustomize |
