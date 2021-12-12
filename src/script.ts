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

let number_of_camera_axis = 6;
let camera : THREE.ArrayCamera;
let renderer : THREE.WebGLRenderer;
let scene : THREE.Scene = null;
let box: THREE.Mesh;
let refRequestAnimationFrame : number|null = null;

window.onload = () => {
    init();
    animate();
    setInterval(() => {
        if(refRequestAnimationFrame) {
            cancelAnimationFrame(refRequestAnimationFrame);
        }
        number_of_camera_axis = Math.floor(Math.random() * 20) + 1;
        console.log(number_of_camera_axis)
        clearScene();
        init();
        animate();
    }, 5000);
    window.addEventListener( 'resize', onWindowResize );
}

function init() {
    const ASPECT_RATIO = window.innerWidth / window.innerHeight;

    const WIDTH = ( window.innerWidth / number_of_camera_axis ) * window.devicePixelRatio;
    const HEIGHT = ( window.innerHeight / number_of_camera_axis ) * window.devicePixelRatio;

    // cameras
    const cameras = [];
    for ( let y = 0; y < number_of_camera_axis; y ++ ) {
        for ( let x = 0; x < number_of_camera_axis; x ++ ) {
        const subcamera = new THREE.PerspectiveCamera( 40, ASPECT_RATIO, 0.1, 20 );
        (subcamera as any).viewport = new THREE.Vector4( Math.floor( x * WIDTH ), Math.floor( y * HEIGHT ), Math.ceil( WIDTH ), Math.ceil( HEIGHT ) );
        subcamera.position.x = ( x / number_of_camera_axis ) + CAMERA_POSITIONS[(x+y) % CAMERA_POSITIONS.length][0];
        subcamera.position.y = ( y / number_of_camera_axis ) + CAMERA_POSITIONS[(x+y) % CAMERA_POSITIONS.length][1];
        subcamera.position.z =  CAMERA_POSITIONS[(x+y) % CAMERA_POSITIONS.length][2];

        subcamera.position.multiplyScalar(3);
        subcamera.lookAt(0, 0, 0);
        subcamera.updateMatrixWorld();
        cameras.push( subcamera );
        }
    }
    // instanciate the camera array
    camera = new THREE.ArrayCamera(cameras);
    camera.position.z = 3;

    scene =  new THREE.Scene();
    // Lights
    scene.add(new THREE.AmbientLight(0xFFFFFF));

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
}

function onWindowResize() {
    init();
}

function animate() {
    box.rotation.x += 0.005;
    box.rotation.z += 0.01;

    renderer.render( scene, camera );

    refRequestAnimationFrame = requestAnimationFrame(animate);
}

function clearScene() {
    let to_remove : THREE.Object3D[]= [];

    scene.traverse ( function( child ) {
        if ( child instanceof THREE.Mesh && !child.userData.keepMe === true ) {
            to_remove.push( child );
         }
    } );

    for ( var i = 0; i < to_remove.length; i++ ) {
        scene.remove( to_remove[i] );
    }
}