function Setup() {
    //Setup everything.
    SetupGlobalVariables();
    SetupEventListeners();
    SetupPhysics();
    SetupRenderer();
    SetupCamera();
    SetupLights();
    SetupCursor();
    SetupFPSChart();
    SetupSceneObjects();

    //Start the render loop.
    Render();
}

function SetupSceneObjects() {
    for (var i = 0; i < 10; ++i)
        AddRandomCube();

    AddGround();
}

function SetupFPSChart() {
    stats = new Stats();
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.top = '0px';
    stats.domElement.style.zIndex = 100;
    document.body.appendChild(stats.domElement);
}

function SetupCursor()
{
    var cursor	= document.createElement( 'label' );
    cursor.innerHTML = "+";
    cursor.style.position = 'absolute';
    cursor.style.color = 'green';
    //cursor.disabled = true;
    document.body.appendChild( cursor );

    var rect = cursor.getBoundingClientRect();
    cursor.style.left = (window.innerWidth / 2 - rect.width / 2) + 'px';
    cursor.style.bottom	= (window.innerHeight / 2 - rect.height / 2) + 'px';
}

function SetupLights()
{
    scene.add(new THREE.AmbientLight(0x000044));

    var directionalLight = new THREE.DirectionalLight(0xffffff);
    directionalLight.position.set(0, 100, 0);
    directionalLight.castShadow = true;
    directionalLight.shadowDarkness = 1.0;
    directionalLight.shadowCameraVisible = false;
    directionalLight.shadowBias = 0.01;
    directionalLight.shadowCameraRight = 500;
    directionalLight.shadowCameraLeft = -500;
    directionalLight.shadowCameraTop = 500;
    directionalLight.shadowCameraBottom = -500;
    directionalLight.shadowCameraNear = 0;
    directionalLight.shadowCameraFar = 110;

    scene.add(directionalLight);
}

function SetupGlobalVariables()
{
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 2000);
    cameraYawObject = new THREE.Object3D();
    renderer = new THREE.WebGLRenderer({antialias: true});
    keyStates = [];
    mouseIsDown = false;
    speedFactor = 1;
    rotationFactor = 1 / 500;
    timeStep = 1 / 60;
    enableLogging = true;
    projector = new THREE.Projector();
    forwardVector = new THREE.Vector3(0, 0, 0);
    pickedObject = null;
    forwardDirection = null;

}

function SetupCamera()
{
    camera.position = new THREE.Vector3(0, 0, 0);
    camera.rotation.x = -0.25;
    cameraYawObject.position = new THREE.Vector3(76, 114, 187);
    cameraYawObject.rotation.y = 0.384;
    cameraYawObject.add(camera);
    scene.add(cameraYawObject);
}

function SetupRenderer()
{
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMapEnabled = true;
    renderer.shadowMapType = THREE.PCFSoftShadowMap;
    document.body.appendChild(renderer.domElement);
}

function SetupEventListeners()
{
    document.addEventListener('mousemove', mouseMove, false);
    document.addEventListener('click', click, false);
    document.addEventListener('keydown', keyDown, false);
    document.addEventListener('keyup', keyUp, false);
    document.addEventListener('mousedown', mouseDown, false);
    document.addEventListener('mouseup', mouseUp, false);
}

function SetupPhysics()
{
    world = new CANNON.World();
    world.gravity.set(0, 0, 0);
    world.broadphase = new CANNON.NaiveBroadphase();
    world.solver.iterations = 10;
}

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

        pickedObject = obj;
        pickedObject.contactPoint = intersection.point;
    }
    else
    {
        pickedObject = null;
    }
};


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

    if(mouseIsDown)
    {
        if(pickedObject != null)
        {
            var forceVector = forwardDirection.clone();
            forceVector.multiplyScalar(100);
            forceVector = new CANNON.Vec3(forceVector.x, forceVector.y, forceVector.z);

            var point = new CANNON.Vec3(pickedObject.contactPoint.x, pickedObject.contactPoint.y, pickedObject.contactPoint.z);

            pickedObject.physicsBody.applyForce(forceVector, point);
        }
    }
};



function AddRandomCube() {

    var width = Math.floor(Math.random() * 10 + 1);
    var height = Math.floor(Math.random() * 10 + 1);
    var length = Math.floor(Math.random() * 10 + 1);

    var geometry = new THREE.BoxGeometry(width, height, length);
    var material = new THREE.MeshLambertMaterial({color: Math.floor((Math.random() * 10000000000)), wireframe: false});
    var cube = new THREE.Mesh(geometry, material);

    cube.position.x = Math.floor(Math.random() * 100 - 50);
    cube.position.y = Math.floor(Math.random() * 100 + 10);
    cube.position.z = Math.floor(Math.random() * 100 - 50);

    var shape = new CANNON.Box(new CANNON.Vec3(width/2,height/2,length/2));
    var mass = 1;
    var body = new CANNON.RigidBody(mass,shape);

    body.position.x = cube.position.x;
    body.position.y = cube.position.y;
    body.position.z = cube.position.z;

    body.allowSleep = true;
    cube.physicsBody = body;
    cube.castShadow = true;

    world.add(cube.physicsBody);
    scene.add(cube);

}

function AddGround() {
    var width = 1000;
    var height = 10;
    var length = 1000;

    var geometry = new THREE.BoxGeometry(width, height, length);
    var material = new THREE.MeshLambertMaterial({color: 'blue'});
    var floor = new THREE.Mesh(geometry, material);

    floor.position = new THREE.Vector3(0,0,0);

    var shape = new CANNON.Box(new CANNON.Vec3(width/2,height/2,length/2));
    var mass = 0;
    var body = new CANNON.RigidBody(mass, shape);

    body.position.x = floor.position.x;
    body.position.y = floor.position.y;
    body.position.z = floor.position.z;

    floor.physicsBody = body;
    floor.receiveShadow = true;

    world.add(floor.physicsBody);
    scene.add(floor);

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

function GoFullScreen()
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

function log(message) {
    if(enableLogging)
        console.log(message);
};

function logCameraInformation() {
    var logString = "";
    logString += camera.position.x;
    logString += ", ";
    logString += camera.position.y;
    logString += ", ";
    logString += camera.position.z;
    logString += "   ";
    logString += camera.rotation.x;
    logString += ", ";
    logString += camera.rotation.y;
    logString += ", ";
    logString += camera.rotation.z;
    logString += "\n";
    logString += cameraYawObject.position.x;
    logString += ", ";
    logString += cameraYawObject.position.y;
    logString += ", ";
    logString += cameraYawObject.position.z;
    logString += "   ";
    logString += cameraYawObject.rotation.x;
    logString += ", ";
    logString += cameraYawObject.rotation.y;
    logString += ", ";
    logString += cameraYawObject.rotation.z;


    log(logString);
}

function updatePhysics() {
    world.step(timeStep);

    for (var i = 0; i < scene.children.length; ++i) {
        var obj = scene.children[i];
        if (obj instanceof THREE.Mesh) {
            obj.physicsBody.position.copy(obj.position);
            obj.physicsBody.quaternion.copy(obj.quaternion);
        }
    }
}

function click(event) {
    LockPointer();
    //GoFullScreen();
}

function mouseMove(event) {
    if(document.webkitPointerLockElement != null)
    {
        camera.rotation.x -= event.webkitMovementY * rotationFactor;
        camera.rotation.x = THREE.Math.clamp(camera.rotation.x, -Math.PI / 2, Math.PI / 2);
        cameraYawObject.rotation.y -= event.webkitMovementX * rotationFactor;
    }
}

function mouseUp(event) {
    mouseIsDown = false;
}

function mouseDown(event) {
    mouseIsDown = true;
}

function keyDown(event) {
    keyStates[event.keyCode] = true;

    if (event.keyCode == 32)
        scene.add(AddRandomCube());
}

function keyUp(event) {
    keyStates[event.keyCode] = false;
}

function Render() {
    requestAnimationFrame(Render);
    HandleControls();
    Picking();
    updatePhysics();
    renderer.render(scene, camera);
    stats.update();
}
