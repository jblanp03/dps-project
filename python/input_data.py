##################################
# INPUT DATA


input_data = {1:{'si':2, 'no':202},
2:{'si':3},
3:{'si':4},
4:{'si':5},
5:{'si':6},
6:{'si':7},
7:{'si':8},
8:{'si':9},
9:{'si':10},
10:{'si':11},
11:12,
202:{'si':301,'no':203},
203:{'si':204, 'no':205},
201:{'si':202, 'no':1},
200:{'si':202, 'no':1},
300:{'si':301, 'no':202},
301:302,
302:303
}

emptyGlobal = []
# Lista CASE 1:
hungry = {'I was hungry': ['Not enough food from canteen', 'Not enough refreshment breaks']}
noise = {'Could not hear clearly': {'In classrooms': ['Classroom acoustics', 'Poor AV equipment', 'Noise background'], 'In practical sessions': ['Instructor not loud enough', 'Bad acoustics', 'Background noise interference'], 'Could not understand instructor due to language issues': ['I am not native English speaker', 'I found local dialect difficult to understand']}}
tired = {'I was tired': ['Sessions start too early', 'Sessions end too late', 'Other reason']}
dict_1_case_1 = {'':['More time between elements','More use of videoclips','PC simulators so elements could be practiced/familiarized before course','Less PowerPoint']}
dict_2_case_1 = {'':['No, always instructor was always available','At times instructor tied up with one candidate so training slowed for everybody','At times there was no instructor overseeing the class']}




def switch_response_avatar(node):
    

    # CASE 1
    _1_1 = ['It looks like you were pretty satisfied with your training, but there is always room for improvement!']
    _1_2 = ['Have you taken this course before?']
    _1_3 = ['During teaching of any topic in your course, describe one memorable incident that occurred or outstanding soundbite you recall.']
    _1_4 = ['What teaching technique or teaching aid might our instructor have employed to get concepts across more clearly?' ]
    _1_5 = ['Were any of your needs not met?', [hungry, noise, tired]]
    _1_6 = ['What else should we start doing to ensure your needs would be met?']
    _1_7 = ['What are we doing that prevents your needs being met?']
    _1_8 = ['What was the highlight of our training -  a single incident or soundbite that stuck in yor mind?']
    _1_9 = ['What should we change about our facilities that would have made your visit more comfortable?']
    _1_10 = ['Would any of these have made your course run better?', [dict_1_case_1]]
    _1_11 = ['Could we have supervised your course any better?', [dict_2_case_1]]
    _1_12 = ['It looks like you were not 100'+'%'+' satisfied course objectives were met.', 'What should we start teaching for the course to better meets your expectations next time?']
    _1_13 = ['What content should we stop teaching -  perhaps something you knew already, felt was irrelevant or was so obvious that you lost interest?']

    
    
    # CASE 2
    _2_0 = ['¡Parece que has quedado bastante satisfecho con tu entrenamiento, aunque siempre hay margen de mejora! ¿Has realizado este curso anteriormente?']
    _2_1 = ['¡Parece que no has quedado satisfecho con tu entrenamiento! ¿Has realizado este curso anteriormente?']
    _2_2 = ['¿Eres un instructor de otro MSTC?']
    _2_3 = ['¿Tenías experiencia previa (oficial de barco, manager, etc.)?']
    _2_4 = ['¿Podrías poner algún ejemplo de incidente marítimo que hayas pasado personalmente o conozcas de primera mano?']
    _2_5 = ['En relación con el curso que has tomado, ¿qué consejo podrías dar a un nuevo reclutado en tu trabajo?']


    # CASE 3
    _3_0 = ['¿Eres un instructor de MSTC?']
    _3_1 = ['¿Puedes dar un ejemplo de un tema que usted sienta que se enseñe mejor en sus instalaciones?']
    _3_2 = ['Basado en el enfoque adoptada en su MSTC, ¿qué deberíamos dejar de enseñar?']
    _3_3 = ['¿Cuál es el elemento mejor enseñado en nuestro curso (y porqué se destaca nuestro enfoque)?']


    # CASE 4
    _4_0 = ['¡Parece que podríamos haberlo hecho mejor! ¿Has tomado este curso anteriormente?']



    
 
    despedida = ''


    switcher = {
        1: _1_1,
        2: _1_2,
        3: _1_3,
        4: _1_4,
        5: _1_5,
        6: _1_6,
        7: _1_7,
        8: _1_8,
        9: _1_9,
        10: _1_10,
        11: _1_11,
        12: _1_12,
        13: _1_13,
        # Case 2
        200:_2_0,
        201:_2_1,
        202:_2_2,
        203:_2_3,
        204:_2_4,
        205:_2_5,
        # Case 3
        300:_3_0,
        301:_3_1,
        302:_3_2,
        303:_3_3,
        # Case 4
        400:_4_0,




    }



    return (switcher.get(node, despedida))


#####################################







# Input flux: case 1
case_1 = {1:{'si':2},
2:{'si':3},
3:{'si':4},
4:{'si':5},
5:{'si':6},
6:{'si':7},
7:{'si':8},
8:{'si':9},
9:{'si':10},
10:{'si':11},
11:12
}