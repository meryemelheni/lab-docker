#!/bin/bash
# ============================================================
# Script de déploiement TaskFlow sur K3s
# Usage : bash k8s/deploy-k3s.sh
# Prérequis : K3s installé, Docker disponible pour le build
# ============================================================

set -e  # Arrêt immédiat en cas d'erreur

PROJECT_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
K8S_DIR="$PROJECT_ROOT/k8s"

echo "============================================"
echo "  🚀 Déploiement TaskFlow sur K3s"
echo "============================================"

# --------------------------------------------------
# ÉTAPE 1 : Build des images Docker
# --------------------------------------------------
echo ""
echo "📦 [1/5] Build des images Docker..."

docker build -t taskflow-backend:latest "$PROJECT_ROOT/backend"
echo "  ✅ taskflow-backend:latest construit"

docker build -t taskflow-frontend:latest \
  --build-arg VITE_API_URL=/api \
  -f "$PROJECT_ROOT/frontend/Dockerfile" \
  "$PROJECT_ROOT"
echo "  ✅ taskflow-frontend:latest construit"

# --------------------------------------------------
# ÉTAPE 2 : Export et import dans containerd K3s
# --------------------------------------------------
echo ""
echo "📥 [2/5] Import des images dans K3s (containerd)..."

docker save taskflow-backend:latest | sudo k3s ctr images import -
echo "  ✅ taskflow-backend importé dans containerd"

docker save taskflow-frontend:latest | sudo k3s ctr images import -
echo "  ✅ taskflow-frontend importé dans containerd"

# --------------------------------------------------
# ÉTAPE 3 : Application des manifests Kubernetes
# --------------------------------------------------
echo ""
echo "⚙️  [3/5] Application des manifests Kubernetes..."

kubectl apply -k "$K8S_DIR/"
echo "  ✅ Tous les manifests appliqués"

# --------------------------------------------------
# ÉTAPE 4 : Attente du démarrage des pods
# --------------------------------------------------
echo ""
echo "⏳ [4/5] Attente du démarrage de la base de données..."
kubectl wait --for=condition=ready pod -l app=database \
  -n taskflow --timeout=120s
echo "  ✅ Base de données prête"

echo "⏳ Attente du démarrage du backend..."
kubectl wait --for=condition=ready pod -l app=backend \
  -n taskflow --timeout=60s
echo "  ✅ Backend prêt"

echo "⏳ Attente du démarrage du frontend..."
kubectl wait --for=condition=ready pod -l app=frontend \
  -n taskflow --timeout=60s
echo "  ✅ Frontend prêt"

# --------------------------------------------------
# ÉTAPE 5 : Affichage du statut final
# --------------------------------------------------
echo ""
echo "📊 [5/5] Statut du déploiement :"
echo ""
kubectl get pods -n taskflow
echo ""
kubectl get svc -n taskflow
echo ""
kubectl get ingress -n taskflow

# Récupération de l'IP du nœud
NODE_IP=$(kubectl get nodes -o jsonpath='{.items[0].status.addresses[?(@.type=="InternalIP")].address}')

echo ""
echo "============================================"
echo "  ✅ Déploiement TaskFlow terminé !"
echo "============================================"
echo ""
echo "🌍 Accès à l'application :"
echo "   → http://${NODE_IP}/"
echo "   → http://${NODE_IP}/api/tasks"
echo ""
echo "🔍 Commandes utiles :"
echo "   kubectl get pods -n taskflow"
echo "   kubectl logs -l app=backend -n taskflow"
echo "   kubectl describe pod <nom-du-pod> -n taskflow"
echo ""
