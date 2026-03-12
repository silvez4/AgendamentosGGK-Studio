#!/usr/bin/env powershell

$PROJECT_ID = "agendamentosgk"

Write-Host "Configurando projeto GCP: $PROJECT_ID..."

# Definir o projeto
gcloud config set project $PROJECT_ID

# Habilitar APIs necessarias
Write-Host "Habilitando APIs (isso pode demorar alguns minutos)..."
gcloud services enable firestore.googleapis.com
gcloud services enable identitytoolkit.googleapis.com
gcloud services enable firebase.googleapis.com
gcloud services enable cloudbuild.googleapis.com

# Criando service account
$SA_NAME = "firebase-admin"
$SA_EMAIL = "$SA_NAME@$PROJECT_ID.iam.gserviceaccount.com"

Write-Host "Criando account de servico $SA_NAME..."
gcloud iam service-accounts create $SA_NAME --display-name="Firebase Admin SDK"

# Adicionando permissoes a service account
Write-Host "Atribuindo acesso de administrador do Firebase a $SA_EMAIL..."
gcloud projects add-iam-policy-binding $PROJECT_ID --member="serviceAccount:$SA_EMAIL" --role="roles/firebase.admin"
gcloud projects add-iam-policy-binding $PROJECT_ID --member="serviceAccount:$SA_EMAIL" --role="roles/datastore.user"

# Gerando a chave JSON local
$KEY_PATH = "backend/src/main/resources/serviceAccountKey.json"
Write-Host "Gerando arquivo de chaves em $KEY_PATH..."
New-Item -ItemType Directory -Force -Path "backend/src/main/resources" | Out-Null
gcloud iam service-accounts keys create $KEY_PATH --iam-account=$SA_EMAIL

Write-Host "Configuração GCP concluida!"
Write-Host "Lembre-se de acessar o Firebase Console (https://console.firebase.google.com/)" 
Write-Host "e adicionar o projeto $PROJECT_ID, alem de inicializar o Firestore DataBase e o Authentication (Email/Password)."
