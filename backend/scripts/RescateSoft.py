import os
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import numpy as np
from sqlalchemy import create_engine
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, accuracy_score, confusion_matrix, ConfusionMatrixDisplay

# Datos de conexión
server = 'LUSHOOC\\LUSHOOC'
database = 'Portafolio'
username = 'sa'
password = 'perro1234'

# Crear la conexión usando SQLAlchemy
connection_string = f"mssql+pymssql://{username}:{password}@{server}/{database}"
engine = create_engine(connection_string)

# Directorio de salida para las gráficas
output_dir = './static/plots'
os.makedirs(output_dir, exist_ok=True)

# Cargar los datos
query = "SELECT * FROM Siniestro"
df_siniestro = pd.read_sql(query, con=engine)

# Limpieza de datos
df_siniestro['perdidas_materiales'] = df_siniestro['perdidas_materiales'].map({'Alta': 3, 'Moderada': 2, 'Baja': 1, 'Ninguna': 0})
df_siniestro['afectados'] = df_siniestro['afectados'].str.extract('(\d+)').astype(float)
df_siniestro = pd.get_dummies(df_siniestro, columns=['implementos_utilizados'], drop_first=True)
df_siniestro['hora'] = pd.to_datetime(df_siniestro['hora'], format='%H:%M:%S').dt.hour
df_siniestro['turno'] = pd.cut(df_siniestro['hora'], bins=[-1, 6, 12, 18, 24], labels=['madrugada', 'mañana', 'tarde', 'noche'])

# Entrenamiento del modelo
X = df_siniestro[['afectados', 'tipo_siniestro_id', 'comuna_id', 'hora'] + list(df_siniestro.columns[df_siniestro.columns.str.startswith('implementos_utilizados_')])]
y = df_siniestro['perdidas_materiales']
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

rf_model = RandomForestClassifier(n_estimators=100, random_state=42)
rf_model.fit(X_train, y_train)
y_pred = rf_model.predict(X_test)

# Guardar métricas en un archivo de texto
metrics_file = os.path.join(output_dir, 'metrics.txt')
with open(metrics_file, 'w') as f:
    f.write(f"Precisión del modelo: {accuracy_score(y_test, y_pred):.2f}\n")
    f.write("Matriz de confusión:\n")
    f.write(str(confusion_matrix(y_test, y_pred)) + '\n')
    f.write("\nInforme de clasificación:\n")
    f.write(classification_report(y_test, y_pred) + '\n')

# Función para guardar gráficas
def save_plot(fig, filename):
    filepath = os.path.join(output_dir, filename)
    fig.savefig(filepath)
    plt.close(fig)  # Cerrar la figura para liberar memoria

# **1. Histograma de afectados**
def plot_afectados_hist(df):
    fig = plt.figure(figsize=(10, 6))
    sns.histplot(df['afectados'], bins=20, kde=True, color="blue")
    plt.title('Distribución de Afectados', fontsize=16)
    plt.xlabel('Número de Afectados', fontsize=14)
    plt.ylabel('Frecuencia', fontsize=14)
    plt.grid(axis='y', linestyle='--', alpha=0.7)
    save_plot(fig, 'afectados_hist.png')

# **2. Distribución de tipos de siniestro**
def plot_tipo_siniestro_dist(df):
    fig = plt.figure(figsize=(18, 15))  # Aumentar el tamaño del gráfico
    sns.countplot(
        x='tipo_siniestro_id',
        data=df,
        palette='coolwarm',
        edgecolor='black',
        linewidth=0.8
    )
    plt.title('Distribución de Tipos de Siniestro', fontsize=20)
    plt.xlabel('Tipo de Siniestro', fontsize=16)
    plt.ylabel('Frecuencia', fontsize=16)
    
    # Mostrar solo cada 5 etiquetas del eje X para evitar saturación
    xticks = plt.gca().get_xticks()  # Obtener las posiciones de las etiquetas
    plt.xticks(xticks[::5], fontsize=14, rotation=45)  # Mostrar etiquetas cada 5 posiciones
    
    plt.yticks(fontsize=14)
    plt.grid(axis='y', linestyle='--', alpha=0.7)
    plt.tight_layout()
    save_plot(fig, 'tipo_siniestro_dist.png')



# **3. Pérdidas materiales promedio por turno**
def plot_perdidas_por_turno(df):
    turno_perdidas = df.groupby('turno')['perdidas_materiales'].mean().reset_index()
    fig = plt.figure(figsize=(10, 6))
    sns.barplot(x='turno', y='perdidas_materiales', data=turno_perdidas, palette='viridis')
    plt.title('Pérdidas Materiales Promedio por Turno', fontsize=16)
    plt.xlabel('Turno', fontsize=14)
    plt.ylabel('Pérdidas Materiales (Promedio)', fontsize=14)
    plt.grid(axis='y', linestyle='--', alpha=0.7)
    save_plot(fig, 'perdidas_por_turno.png')

# **4. Matriz de correlación**
def plot_correlation_matrix(df):
    numerical_columns = df.select_dtypes(include=[np.number])
    if not numerical_columns.empty:
        correlation_matrix = numerical_columns.corr()
        fig = plt.figure(figsize=(8, 8))
        sns.heatmap(correlation_matrix, annot=True, cmap='coolwarm', fmt='.2f')
        plt.title('Mapa de Calor de Correlaciones', fontsize=16)
        save_plot(fig, 'correlation_matrix.png')

# **5. Distribución de Tipos de Siniestro Predichos**
def plot_tipo_siniestro_pred(y_pred):
    pred_count = pd.Series(y_pred).value_counts()
    fig = plt.figure(figsize=(10, 6))
    sns.barplot(x=pred_count.index, y=pred_count.values, palette='viridis', edgecolor='black')
    plt.xlabel('Tipo de Siniestro', fontsize=14)
    plt.ylabel('Frecuencia', fontsize=14)
    plt.title('Distribución de Tipos de Siniestro Predichos', fontsize=16)
    plt.xticks(rotation=45, fontsize=12)
    plt.yticks(fontsize=12)
    plt.tight_layout()
    save_plot(fig, 'tipo_siniestro_pred.png')

# **6. Importancia de las Características**
def plot_feature_importance(model, features):
    importances = model.feature_importances_
    indices = np.argsort(importances)[::-1]  # Ordenar características por importancia
    sorted_features = np.array(features)[indices]
    sorted_importances = importances[indices]

    # Crear la figura
    fig, ax = plt.subplots(figsize=(10, 6))  # Tamaño ajustado para reducir espacios
    sns.barplot(
        x=sorted_importances,
        y=sorted_features,
        palette='viridis',
        edgecolor='black',
        linewidth=0.8,
        ax=ax
    )
    
    # Títulos y etiquetas
    ax.set_title('Importancia de las Características', fontsize=16, pad=10)
    ax.set_xlabel('Importancia', fontsize=12, labelpad=10)
    ax.set_ylabel('Características', fontsize=12, labelpad=10)
    ax.tick_params(axis='x', labelsize=10)
    ax.tick_params(axis='y', labelsize=10)
    
    # Ajustar espaciado para evitar espacios en blanco
    plt.subplots_adjust(left=0.25, right=0.95, top=0.9, bottom=0.15)
    
    # Guardar gráfico
    save_plot(fig, 'feature_importance.png')



# **7. Matriz de confusión**
def plot_confusion_matrix(model, X_test, y_test):
    fig, ax = plt.subplots(figsize=(5, 4))
    ConfusionMatrixDisplay.from_estimator(model, X_test, y_test, ax=ax, cmap='Blues')
    plt.title('Matriz de Confusión del Modelo', fontsize=16)
    save_plot(fig, 'confusion_matrix.png')

# Generar gráficos
plot_afectados_hist(df_siniestro)
plot_tipo_siniestro_dist(df_siniestro)
plot_perdidas_por_turno(df_siniestro)
plot_correlation_matrix(df_siniestro)
plot_tipo_siniestro_pred(y_pred)
plot_feature_importance(rf_model, X.columns)
plot_confusion_matrix(rf_model, X_test, y_test)

print("Gráficos generados y guardados en:", output_dir)
