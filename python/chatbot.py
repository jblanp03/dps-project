import chatbot_h









chatbot_app = chatbot_h.Flask(__name__)



@chatbot_app.route(rule="/getBotAnswer", methods=['POST'])
def get_bot_response():

    # En la query se recibe [id_chat, mensaje, [nodo del flujograma]]. El primer elemento corresponde con el ID único del
    # chat. No se corresponde con un usuario (porque es un sistema anónimo), pero si con el identificador único del chat.
    # El segundo elemento se corresponde con el mensaje del usuario en cuestión, denominado queryInput
    # y el tercer elemento se tratará es el historial de los nodos anteriores del flujograma (si los hubiera) y se tratará
    # como previousDialog.
    

    (usercase, satisfaction, answer, node) = chatbot_h.json.loads(chatbot_h.request.get_data().decode('utf-8'))

    # flowDialog() Función que devuelve la próxima respuesta del flujo
    response = chatbot_h.flow_dialog(usercase, satisfaction, answer, node)

    # data para reenviar al backend
    data_to_send_back = response

    return chatbot_h.json.dumps({'message': data_to_send_back})




