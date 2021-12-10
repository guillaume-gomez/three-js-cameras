import './style.css';
import * as THREE from 'three';

const CAMERA_POSITIONS = [
   [0,0,1.5],
   [1.5,0, 0],
   [-1.5,0,0],
   [0,1.5,0],
   [0,-1.5, 0],
   [0,0,-1.5],
]

const NUMBER_OF_CAMERA_AXIS = 6;
let camera : THREE.ArrayCamera;
let renderer : THREE.WebGLRenderer;
let scene : THREE.Scene = new THREE.Scene();
let box: THREE.Mesh;

window.onload = () => {
    init();
    animate();
}

function init() {
    const ASPECT_RATIO = window.innerWidth / window.innerHeight;

    const WIDTH = ( window.innerWidth / NUMBER_OF_CAMERA_AXIS ) * window.devicePixelRatio;
    const HEIGHT = ( window.innerHeight / NUMBER_OF_CAMERA_AXIS ) * window.devicePixelRatio;

    // cameras
    const cameras = [];
    for ( let y = 0; y < NUMBER_OF_CAMERA_AXIS; y ++ ) {
        for ( let x = 0; x < NUMBER_OF_CAMERA_AXIS; x ++ ) {
        const subcamera = new THREE.PerspectiveCamera( 40, ASPECT_RATIO, 0.1, 20 );
        (subcamera as any).viewport = new THREE.Vector4( Math.floor( x * WIDTH ), Math.floor( y * HEIGHT ), Math.ceil( WIDTH ), Math.ceil( HEIGHT ) );
        subcamera.position.x = ( x / NUMBER_OF_CAMERA_AXIS ) + CAMERA_POSITIONS[(x+y) % CAMERA_POSITIONS.length][0];
        subcamera.position.y = ( y / NUMBER_OF_CAMERA_AXIS ) + CAMERA_POSITIONS[(x+y) % CAMERA_POSITIONS.length][1];
        subcamera.position.z =  CAMERA_POSITIONS[(x+y) % CAMERA_POSITIONS.length][2];

        subcamera.position.multiplyScalar(3);
        subcamera.lookAt(0, 0, 0);
        //subcamera.position.z = 0;
        console.log(subcamera.rotation)
        subcamera.updateMatrixWorld();
        cameras.push( subcamera );
        }
    }
    // instanciate the camera array
    camera = new THREE.ArrayCamera(cameras);
    camera.position.z = 3;

    // Lights
    scene.add(new THREE.AmbientLight("#FFFFFF"));

    // Objects

    // background
    const geometryBackground = new THREE.BoxGeometry(10,10,10);
    const materialBackground = new THREE.MeshPhongMaterial( { color: 0x00FAAFAA, side: THREE.BackSide } );
    let background = new THREE.Mesh( geometryBackground, materialBackground );
    scene.add(background);

    // box
    const geometry = new THREE.BoxBufferGeometry(1, 1, 1);
    var materials = [
        new THREE.MeshBasicMaterial({color: "#43001d"}),
        new THREE.MeshBasicMaterial({color: "#64002c"}),
        new THREE.MeshBasicMaterial({color: "#851a2c"}),
        new THREE.MeshBasicMaterial({color: "#d94e2c"}),
        new THREE.MeshBasicMaterial({color: "#f67c28"}),
        new THREE.MeshBasicMaterial({color: "#3a042d"})
      ];
    box = new THREE.Mesh(geometry, materials);
    box.castShadow = true;
    box.receiveShadow = true;
    scene.add(box);

    // Instanciate Renderer
    renderer = new THREE.WebGLRenderer({
        canvas: document.querySelector('canvas.webgl'),
        antialias: true
    });
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.shadowMap.enabled = true;

    window.addEventListener( 'resize', onWindowResize );
}

function onWindowResize() {

}

function animate() {
    box.rotation.x += 0.005;
    box.rotation.z += 0.01;

    renderer.render( scene, camera );

    requestAnimationFrame(animate);
}