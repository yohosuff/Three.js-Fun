var enableLogging = true;
var projector = new THREE.Projector();
var forwardVector = new THREE.Vector3(0, 0, 0);
var pickedObject = null;

var Picking = function () {
    var totalRotation = new THREE.Euler(camera.rotation.x, cameraYawObject.rotation.y, 0, "YXZ");
    var cursorDirection = forwardVector.clone();
    cursorDirection.applyEuler(totalRotation);
    var rayCaster = projector.pickingRay(cursorDirection.clone(), camera);
    var intersects = rayCaster.intersectObjects(scene.children);
    if(intersects.length > 0)
    {
        var intersection = intersects[0],
            obj = intersection.object;

        //obj.material.color.setRGB(1.0, 0, 0);

        pickedObject = obj;
        pickedObject.contactPoint = intersection.point;
    }
    else
    {
        pickedObject = null;
    }
};

var PlaceCursor = function () {
    var cursor	= document.createElement( 'label' );
    cursor.innerHTML = "+";
    cursor.style.position = 'absolute';
    cursor.style.color = 'green';
    cursor.disabled = true;
    document.body.appendChild( cursor );

    var rect = cursor.getBoundingClientRect();

    cursor.style.left = (window.innerWidth / 2 - rect.width / 2) + 'px';
    cursor.style.bottom	= (window.innerHeight / 2 - rect.height / 2) + 'px';

};

var forwardDirection = null;

var HandleControls = function()
{
    var totalRotation = new THREE.Euler(camera.rotation.x, cameraYawObject.rotation.y, 0, "YXZ");
    forwardDirection = new THREE.Vector3(0, 0, -1);
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

var bodies = [];

function AddRandomCube() {

    var width = Math.floor(Math.random() * 10 + 1);
    var height = Math.floor(Math.random() * 10 + 1);
    var length = Math.floor(Math.random() * 10 + 1);

    var geometry = new THREE.BoxGeometry(width, height, length);
    var material = new THREE.MeshBasicMaterial({color: Math.floor((Math.random() * 10000000000)), wireframe: true});
    var cube = new THREE.Mesh(geometry, material);

    cube.position.x = Math.floor(Math.random() * 100 - 50);
    cube.position.y = Math.floor(Math.random() * 100 - 50);
    cube.position.z = Math.floor(Math.random() * 100 - 50);

    var shape = new CANNON.Box(new CANNON.Vec3(width/2,height/2,length/2));
    var mass = 1;
    var body = new CANNON.RigidBody(mass,shape);

    body.position.x = cube.position.x;
    body.position.y = cube.position.y;
    body.position.z = cube.position.z;

    cube.joeysBody = body;

    world.add(cube.joeysBody);
    scene.add(cube);
    //bodies.push([body, cube]);

}

function AddCube() {
    /*
     var width = Math.floor((Math.random() * 21) - 9);
     var height = Math.floor((Math.random() * 21) - 9);
     var length = Math.floor((Math.random() * 21) - 9);
     */

    var width = 1000;
    var height = 1;
    var length = 1000;

    var geometry = new THREE.BoxGeometry(width, height, length);
    var material = new THREE.MeshBasicMaterial({color: Math.floor((Math.random() * 10000000000)), wireframe: true});
    var cube = new THREE.Mesh(geometry, material);

    cube.position.x = Math.floor(0);
    cube.position.y = Math.floor(0);
    cube.position.z = Math.floor(0);

    var shape = new CANNON.Box(new CANNON.Vec3(width/2,height/2,length/2));
    var mass = 1;
    var body = new CANNON.RigidBody(0,shape);

    body.position.x = cube.position.x;
    body.position.y = cube.position.y;
    body.position.z = cube.position.z;



    cube.joeysBody = body;

    world.add(cube.joeysBody);
    scene.add(cube);
    //bodies.push([body, cube]);

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
};

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
};

var log = function (message) {
    if(enableLogging)
        console.log(message);
};
