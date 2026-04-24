# 🌐 Guide de Déploiement sur Serveur Distant (K3s)

Ce guide explique comment déployer votre projet TaskFlow sur votre machine virtuelle serveur.

## Étape 1 : Préparation du Serveur

Connectez-vous à votre serveur en SSH et installez les outils nécessaires.

### 1.1 Installer Docker (pour le build des images)
```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER
# Déconnectez-vous et reconnectez-vous pour appliquer les changements de groupe
```

### 1.2 Installer K3s
```bash
curl -sfL https://get.k3s.io | sh -
# Vérifier l'installation
sudo kubectl get nodes
```

## Étape 2 : Transférer le Projet sur le Serveur

Vous pouvez utiliser `git clone` si votre projet est sur GitHub/GitLab, ou utiliser `scp` depuis votre machine locale :

```bash
# Depuis votre machine locale (remplacez user et ip)
scp -r ./lab-docker-compose user@ip-serveur:~/
```

## Étape 3 : Lancer le Déploiement

Une fois sur le serveur, déplacez-vous dans le dossier du projet et lancez le script automatisé que j'ai préparé :

```bash
cd ~/lab-docker-compose

# Rendre le script exécutable
chmod +x k8s/deploy-k3s.sh

# Lancer le déploiement (le script buildera les images et les injectera dans k3s)
bash k8s/deploy-k3s.sh
```

## Étape 4 : Accéder à l'Application

L'application sera accessible sur l'adresse IP de votre serveur :

- **Frontend** : `http://<ip-serveur>/`
- **Backend (API)** : `http://<ip-serveur>/api/tasks`

## 🔍 Commandes de diagnostic utiles

- Voir les logs du backend : `kubectl logs -l app=backend -n taskflow`
- Voir l'état des pods : `kubectl get pods -n taskflow`
- Vérifier l'Ingress (Traefik) : `kubectl get ingress -n taskflow`
