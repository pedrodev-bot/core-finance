from database import engine, Base
import models

print("A eliminar todas as tabelas...")
Base.metadata.drop_all(bind=engine)

print("A recriar as tabelas do zero...")
Base.metadata.create_all(bind=engine)

print("Base de dados limpa com sucesso!")