
function log(text) {
    console.log("At time: " + (performance.now() / 1000).toFixed(3) + " --> "
        + text);
}
const localVideo = document.getElementById("localVideo");
const remoteVideo = document.getElementById("remoteVideo");
const start = document.getElementById("start");
const call = document.getElementById("call");
const hang = document.getElementById("hang");
let localPeerConnection, remotePeerConnection;

start.onclick = (e) => {
    navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
        localStream = stream;
        localVideo.srcObject = localStream;
    })
}

call.onclick = async function (e) {
    localPeerConnection = new RTCPeerConnection();
    localPeerConnection.onicecandidate = gotLocalIceCandidate;
    remotePeerConnection = new RTCPeerConnection();
    remotePeerConnection.onicecandidate = gotRemoteIceCandidate;
    localPeerConnection.addStream(localStream);
    log("Added localStream to localPeerConnection ");
    remotePeerConnection.onaddstream = gotRemoteStream;
    const offer = await localPeerConnection.createOffer();
    gotLocalDescription(offer);
}
async function gotLocalDescription(description) {
    localPeerConnection.setLocalDescription(description);
    log("Offer from localPeerConnection: \n" + description);
    remotePeerConnection.setRemoteDescription(description);
    const ans = await remotePeerConnection.createAnswer();
    gotRemoteDescription(ans);
}
function gotRemoteDescription(description) {
    remotePeerConnection.setLocalDescription(description);
    log("Answer from remotePeerConnection: \n" + description);
    localPeerConnection.setRemoteDescription(description);
}

function gotRemoteStream(event) {
    remoteVideo.srcObject = event.stream;
    log("Received remote stream");
}
function gotLocalIceCandidate(event) {
    remotePeerConnection.addIceCandidate(event.candidate);
    log("Local ICE candidate: \n");
    console.log(event.candidate);
    // console.log(JSON.stringify(localPeerConnection.localDescription));
}
function gotRemoteIceCandidate(event) {
    localPeerConnection.addIceCandidate(event.candidate);
    log("Remote ICE candidate: \n ");
    console.log(event.candidate);
}

