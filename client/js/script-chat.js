$(document).ready(function(){
  var messages = [];
  var peer_id, name, conn;

  /* Producción */
  var _host = "emo-peerjs-server.herokuapp.com";
  var _port = 443;
  var _secure = true;

  /* Desarrollo*/
  // var _host = "localhost";
  // var _port = 9000;
  // var _secure = false;

//port: location.port || (location.protocol === 'https:' ? 443 : 80),
  var peer = new Peer({
    host: _host,
    port: _port,
    secure: true,
    key: 'peerjs',
    debug: 3, // 0: no prints logs, 3: print all logs
    /*config: {'iceServers': [
    { url: 'stun:stun1.l.google.com:19302' },
    { url: 'turn:numb.viagenie.ca',
      credential: 'muazkh', username: 'webrtc@live.com' }
    ]}*/
  });

  peer.on('open', function(){
    $('#id').text(peer.id);
  });

  
  navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

  function getVideo(callback){
    navigator.getUserMedia({audio: true, video: true}, callback, function(error){
      console.log(error);
      alert('An error occured. Please try again');
    });
  }

  getVideo(function(stream){
    window.localStream = stream;
    onReceiveStream(stream, 'my-camera');
  });

  /* Muestra el video/audio del remote-peer */
  function onReceiveStream(stream, element_id){
    var video = $('#' + element_id + ' video')[0];
    video.src = window.URL.createObjectURL(stream);
    window.peer_stream = stream;
  }

  $('#login').click(function(){
    name = $('#name').val();
    peer_id = $('#peer_id').val();
    if(peer_id){
      conn = peer.connect(peer_id, {metadata: {
        'username': name
      }});
      conn.on('data', handleMessage);
    }

    $('#chat').removeClass('hidden');
    $('#connect').addClass('hidden');
  });

  /* Conectar */
  peer.on('connection', function(connection){
    conn = connection;
    peer_id = connection.peer;
    conn.on('data', handleMessage); // Recibir mensajes

    $('#peer_id').addClass('hidden').val(peer_id);
    $('#connected_peer_container').removeClass('hidden');
    $('#connected_peer').text(connection.metadata.username);
  });

  /* Reproducir sonidos mp3 */
  function reproducirSonido(idSonido){
    // Reproducir sonido 
    var audio = new Audio('/sounds/'+idSonido+'.mp3');
    audio.play();
    return audio;
  }

  /* Recibir mensajes remoto*/
  function handleMessage(data){
    // Reproducir sonido cada vez que actualiza los mensajes
    reproducirSonido('get-message');
    uploadMessagesPanel(data);
  }

  /* Actualizar mensajes en la vista del local */
  function uploadMessagesPanel(data){
    var header_plus_footer_height = 285;
    var base_height = $(document).height() - header_plus_footer_height;
    var messages_container_height = $('#messages-container').height();
    messages.push(data);

    //TODO: Quitar acoplamiento de diseño con la funcionalidad. Debería haber una plantilla para mostrar los mensajes.
    var output = "";

    for (var i = messages.length - 1; i >= 0; i--) {
      var message = messages[i]
      output += "<li><span class='from'>"+message.from+":</span> "+message.text+"</li>";
    }


    $('#messages').html(output);


    if(messages_container_height >= base_height){
      $('html, body').animate({ scrollTop: $(document).height() }, 500);
    }
  }

  /* Enviar un mensaje */
  function sendMessage(){
    var text = $('#message').val();
    var data = {'from': name, 'text': text};

    conn.send(data); // Enviar mensaje al peer-remote
    uploadMessagesPanel(data); // Mostrar mi mensaje
    reproducirSonido('send-message');
    $('#message').val('');
  }

  $('#message').keypress(function(e){
    if(e.which == 13){
      sendMessage();
    }
  });

  $('#send-message').click(sendMessage);

  $('#call').click(function(){
    var audioSendCall = reproducirSonido('send-call');
    console.log('now calling: ' + peer_id);
    console.log(peer);

    /* Iniciando video conferencia */
    var call = peer.call(peer_id, window.localStream); // Llama al remote-peer y envía su video/audio
    call.on('stream', function(stream){
      window.peer_stream = stream;
      onReceiveStream(stream, 'peer-camera');
      audioSendCall.pause();
    });
  });

  peer.on('call', function(call){
    var audioIncommingCall = reproducirSonido('incoming-call');
    acceptCall = window.confirm("Llamada recibida!\r\n¿Deseas aceptar la llamada?"); // Preguntar si desea aceptar la llamada

    /* Si acepta la llamada comienza la video conferencia */
    if (acceptCall) onReceiveCall(call);
    audioIncommingCall.pause(); // Pausar el sonido acepte o no la llamada
  });

  function onReceiveCall(call){
    call.answer(window.localStream);
    call.on('stream', function(stream){
      window.peer_stream = stream;
      onReceiveStream(stream, 'peer-camera');
    });
  }


  // Get all peers
  $("#getAllPeers").click(function(event) {
    getListAllPeers();
  });

  function getListAllPeers(){
    var http = _secure ? "https://" : "http://";
    $.get(http + _host + "/listAllPeers", function(data, textStatus, xhr) {
      console.log(data);
    });  
  }
  

});