
var webrtc = new SimpleWebRTC({
    localVideoEl: 'localVideo',
    remoteVideosEl: '',
    autoRequestMedia: true
});

// we have to wait until it's ready
webrtc.on('readyToCall', function () {
    webrtc.joinRoom('hugo');
});

webrtc.on('videoAdded', function (video, peer) {
    var remotes = document.getElementById('remotesVideos');
    if (remotes) {
        
        var container = document.createElement('div');
        container.className = 'videoContainer';
        container.id = 'container_' + webrtc.getDomId(peer);
        container.appendChild(video);
        container.className = 'row';
        container.margin = "10 0 0 10";
        container.padding = "10 0 0 10";

        // divs
        var id_dinam = webrtc.getDomId(peer);
        var div1 = document.createElement('div');
        var div2 = document.createElement('div');
        var div3 = document.createElement('div');
        var div4 = document.createElement('div');
        var div5 = document.createElement('div');

        div1.id = "div1" + id_dinam;
        div2.id = "div2" + id_dinam;
        div3.id = "div3" + id_dinam;
        div4.id = 'div4' + id_dinam;
        div5.id = 'div5' + id_dinam;

        div1.className = 'col-xs-1';
        div2.className = 'col-md-3';
        div3.className = 'col-md-3';
        div4.className = 'col-md-2';
        div5.className = 'col-xl-3';
        
        var heightVideos = 300;
        var widthVideos = 400;

        // video
        video.height = heightVideos;
        video.oncontextmenu = function () { return false; };
        div2.appendChild(video);

        // canvas:
        var canvas = document.createElement('canvas');
        canvas.height = heightVideos;
        canvas.width = widthVideos;
        div3.appendChild(canvas);

        // pie graph:
        div4.height = heightVideos;
        //div4.width = widthVideos;
        div4.text_align = "center";

        // area graph:
        div5.height = heightVideos;
        div5.width = widthVideos;
        div5.text_align = "center";

        // button:
        var button = document.createElement('button');
        button.innerHTML = " Snap";
        button.className= "btn btn-info fa fa-camera-retro fa-lg fa";
        button.onclick = function() {
            sentimentAnalysis(video, canvas, div4, div5);
        }
        div1.appendChild(button);

        container.appendChild(div1);
        container.appendChild(div2);
        container.appendChild(div3);
        container.appendChild(div4);
        container.appendChild(div5);

        remotes.appendChild(container);
    }
});
