

import input_data

import numpy as np
import joblib
from flask import Flask, request
import json



# FluxTree: Clase para definir la estructura del arbol. Se utilizará para manejar la gestión de los nodos.
class FluxTree:

    def __init__(self, input_flux_data):
        self.input_flux_data = input_flux_data

    def next_node(self, node_a, output_model):
        return self.input_flux_data[node_a][output_model]

    def repeat_node(self, node_a, output_model='repetir'):
        return self.input_flux_data[node_a][output_model]





def flow_dialog(usercase, satisfaction, answer, node):
    '''
    input:
    usercase     [INTEGER]
    satisfaction [FLOAT]
    answer       [VARCHAR]
    node         [INTEGER]

    output:
    node         [node]
    response     [array of VARCHAR]
    ''' 

    last_node_user = node_verification(node)

    # Se analiza el input y el nodo anterior con respecto al flujograma. Se utiliza la clase arbol donde al recibir un input se gestiona el output
    flux_tree = FluxTree(input_data.input_data)
    output_node = flux_tree.next_node(last_node_user, answer)
    # Se obtiene la respuesta a partir del diccionario creado en input_data
    output = input_data.switch_response_avatar(output_node)








# node_verification() Función que sirve para comprobar que es el primer nodo de la conversación. Se adjunta la lista de nodos previa y si esta lista está vacía o apunta
# a 'null' se creará un nuevo id de nodo con el valor X.
def node_verification(node):
    return node














