# Déploiement sur k3s

Ce répertoire contient les manifestes Kubernetes pour déployer l'application TaskFlow sur un cluster k3s.

## Prérequis

1. Un cluster **k3s** fonctionnel.
2. **kubectl** configuré pour communiquer avec le cluster.
3. Les images Docker doivent être disponibles dans le cluster.

## Étape 1 : Préparation des images

Si vous utilisez k3s localement, vous devez construire les images et les importer dans le cluster :

```bash
# Construction des images
docker build -t taskflow-backend:latest ./backend
docker build -t taskflow-frontend:latest -f ./frontend/Dockerfile .

# Importation dans k3s (si k3s est installé localement)
docker save taskflow-backend:latest | sudo k3s ctr images import -
docker save taskflow-frontend:latest | sudo k3s ctr images import -
```

## Étape 2 : Déploiement

Vous pouvez déployer l'ensemble des ressources en utilisant `kustomize` (inclus dans `kubectl`) :

```bash
kubectl apply -k k8s/
```

## Étape 3 : Vérification

Vérifiez que tous les pods sont en cours d'exécution :

```bash
kubectl get pods -n taskflow
```

## Étape 4 : Accès à l'application

L'application est exposée via un **Ingress**. Si vous utilisez k3s avec Traefik par défaut, vous pouvez accéder au frontend sur l'IP de votre noeud k3s.

Si vous avez utilisé le `frontend-service` de type `LoadBalancer`, vous pouvez obtenir l'IP avec :

```bash
kubectl get svc -n taskflow frontend-service
```
