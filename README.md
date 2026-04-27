# 🚀 TaskFlow - Déploiement Multi-Cloud & Orchestration K3s

Ce projet présente le déploiement complet d'une application de gestion de tâches (TaskFlow) utilisant une architecture moderne micro-services, orchestrée avec **Docker Compose** pour le développement et **K3s (Kubernetes)** pour la production sur une VM distante.

---

## 🏗️ Architecture du Projet

L'application est composée de trois services principaux :
1.  **Frontend** : Application React (Vite + TypeScript) avec une interface moderne (Glassmorphism, Tailwind CSS, Shadcn/UI).
2.  **Backend** : API REST Node.js / Express gérant la logique métier et la connectivité DB.
3.  **Database** : Instance PostgreSQL pour la persistance des données.

### Schéma de Communication
`Utilisateur → Ingress (Port 80/8888) → Frontend (Nginx) → Backend (Express) → Database (PostgreSQL)`

---

## 🐳 Phase 1 : Orchestration avec Docker Compose

Pour le développement local, nous utilisons Docker Compose pour isoler les réseaux et gérer les volumes.

### Points clés :
- **Isolation Réseau** : Le frontend ne peut pas communiquer directement avec la base de données.
- **Persistance** : Utilisation d'un volume nommé `postgres-data`.
- **Healthchecks** : Surveillance automatique de l'état des services.

### Lancement :
```bash
docker-compose up --build -d
```
Accès : `http://localhost:8080`

---

## ☸️ Phase 2 : Déploiement Kubernetes (K3s) sur VM Distante

L'étape finale du TP a consisté à porter l'application sur un cluster **K3s v1.34.6** installé sur une machine virtuelle Ubuntu Server.

### 🏗️ Architecture K3s
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

### 🚀 Déploiement Rapide
Pour déployer l'application sur K3s :
```bash
# Rendre le script exécutable
chmod +x k8s/deploy-k3s.sh

# Lancer le déploiement complet
bash k8s/deploy-k3s.sh
```

### Spécifications du déploiement :
- **VM IP** : `192.168.195.148`
- **Orchestrateur** : K3s (Kubernetes léger)
- **Stockage** : PersistentVolumeClaim (PVC) lié via `local-path` StorageClass.
- **Ingress Controller** : Traefik (natif K3s) pour exposer l'application.

### Statut des Ressources :
- **Namespace** : `taskflow`
- **Pods** : 3/3 en état `Running` (database, backend, frontend).
- **Service Type** : ClusterIP pour l'interne, Ingress pour l'externe.

### Accès Production :
- **Interface Web** : [http://192.168.195.148:8888](http://192.168.195.148:8888)
- **API Health** : `http://192.168.195.148:8888/health`

---

## 🛠️ Scripts et Documentation
Le projet inclut des scripts d'automatisation et des guides détaillés :
- `k8s/deploy-k3s.sh` : Script complet de build, import d'images et application des manifests K8s.
- [Guide K3s Complet](k8s/README-K3S.md) : Détails techniques sur le déploiement Kubernetes.
- [Guide Serveur Distant](k8s/REMOTE-SERVER-GUIDE.md) : Mise en place de la VM et de l'environnement.

---

## 📸 Captures d'Écran et Validation

1.  **Statut K3s** : `kubectl get pods -n taskflow` affichant les services opérationnels.
2.  **Interface UI** : Vue de l'application moderne avec le thème sombre et glassmorphism.
3.  **Persistance** : Validation que les tâches restent après un redémarrage des pods.
4.  **Isolation** : Test de connectivité prouvant l'isolation du réseau de données.

---

**Développé par Meryem dans le cadre du TP Docker/Kubernetes.**


