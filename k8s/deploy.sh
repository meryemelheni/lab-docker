#!/bin/bash

echo "🚀 Préparation du déploiement TaskFlow sur k3s..."

# Création du namespace si nécessaire
kubectl apply -f k8s/namespace.yaml

# Application de la configuration (ConfigMaps, Secrets, PVC)
kubectl apply -k k8s/

echo "⏳ Attente du démarrage de la base de données..."
kubectl wait --for=condition=ready pod -l app=database -n taskflow --timeout=60s

echo "✅ Déploiement terminé !"
echo "Utilisez 'kubectl get pods -n taskflow' pour vérifier l'état."
