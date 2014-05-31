var enableLogging = false;

var HandleControls = function()
{
    var totalRotation = new THREE.Euler(camera.rotation.x, cameraYawObject.rotation.y, 0, "YXZ");
    var forwardDirection = new THREE.Vector3(0, 0, -1);
    var strafeDirection = new THREE.Vector3(1, 0, 0);
    var upDirection = new THREE.Vector3(0,1,0);

    forwardDirection.applyEuler(totalRotation);
    strafeDirection.applyEuler(totalRotation);
    upDirection.applyEuler(totalRotation);

    forwardDirection.multiplyScalar(speedFactor);
    strafeDirection.multiplyScalar(speedFactor);
    upDirection.multiplyScalar(speedFactor);

    if (keyStates[87]) cameraYawObject.position.add(forwardDirection); //w
    if (keyStates[83]) cameraYawObject.position.sub(forwardDirection); //s
    if (keyStates[68]) cameraYawObject.position.add(strafeDirection); //d
    if (keyStates[65]) cameraYawObject.position.sub(strafeDirection); //a
    if (keyStates[69]) cameraYawObject.position.add(upDirection); //e
    if (keyStates[81]) cameraYawObject.position.sub(upDirection); //q

};

function AddRandomCube() {
    var geometry = new THREE.BoxGeometry(
        Math.floor((Math.random() * 21) - 9),
        Math.floor((Math.random() * 21) - 9),
        Math.floor((Math.random() * 21) - 9));
    var material = new THREE.MeshBasicMaterial({color: Math.floor((Math.random() * 10000000000)), wireframe: true});
    var cube = new THREE.Mesh(geometry, material);

    cube.position.x = Math.floor((Math.random() * 201) - 99);
    cube.position.y = Math.floor((Math.random() * 201) - 99);
    cube.position.z = Math.floor((Math.random() * 201) - 99);

    return cube;
}

var LockPointer = function()
{
    var havePointerLock = 'pointerLockElement' in document ||
        'mozPointerLockElement' in document ||
        'webkitPointerLockElement' in document;

    if (havePointerLock) {
        var element = renderer.domElement;
        element.requestPointerLock =
            element.requestPointerLock ||
            element.mozRequestPointerLock ||
            element.webkitRequestPointerLock;
        element.requestPointerLock();
    }
}

var GoFullScreen = function()
{
    THREEx.WindowResize(renderer, camera);

    var fullscreenEnabled = document.fullscreenEnabled ||
        document.webkitFullscreenEnabled ||
        document.mozFullScreenEnabled ||
        document.msFullscreenEnabled;

    if (fullscreenEnabled) {
        var element = renderer.domElement;
        element.requestFullscreen = element.webkitRequestFullscreen;
        element.requestFullscreen();
    }
}

var log = function (message) {
    if(enableLogging)
        console.log(message);
}
/**
 * Created by yohosuff on 5/31/2014.
 */
