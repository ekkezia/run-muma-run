import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import { Mesh, TextureLoader } from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { FontLoader } from 'three/src/loaders/FontLoader.js'
import { AnimationMixer } from 'three/src/animation/AnimationMixer.js'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js'
import gsap from 'gsap'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment';



alert('THREE');
let camera, scene, renderer, mixer, load;
let objs = []
    // Canvas
const canvas = document.querySelector('canvas.webgl')
const clock = new THREE.Clock()
const elapsedTime = clock.getElapsedTime()

let sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}
let ready = []
init();
character();
onWindowResize();

function init() {
    // Scene
    scene = new THREE.Scene()
    const texLoad = new THREE.TextureLoader();

    // Base camera
    camera = new THREE.PerspectiveCamera(100, sizes.width / sizes.height, 1, 10000)
    camera.position.x = 0
    camera.position.y = 0
    camera.position.z = 5
    camera.rotation.y = 2
    scene.add(camera)

    //Modeling light

    const light = new THREE.AmbientLight(0x404040); // soft white light
    light.intensity = 5;
    light.position.set(0, 300, 0);
    scene.add(light);

    const dirLight = new THREE.DirectionalLight(0xffffff);
    dirLight.intensity = 5;
    dirLight.position.set(75, 300, -75);
    scene.add(dirLight);

    // Materials
    const material = new THREE.MeshBasicMaterial({})
    material.color = new THREE.Color(0xff00ff)
    material.transparency = true;

    //Renderer
    renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true
    })
    renderer.setSize(sizes.width, sizes.height)
    document.body.appendChild(renderer.domElement);


    //Controls
    const controls = new OrbitControls(camera, renderer.domElement); //renderer dom element is canvas
    controls.target.set(0, 0, 0);
    controls.update();

    // controls.addEventListener('change', render);

    //Window Size
    window.addEventListener('resize', onWindowResize);

    render();
}

function character() {
    //Model Loader
    let gltfLoader = new GLTFLoader();
    let mod;
    for (let n = 1; n <= 15; n++) {
        for (let i = 1; i <= 4; i++) {
            gltfLoader.load('3d/Muma' + n + '.glb',
                function(gltf) {
                    mod = gltf.scene;
                    mod.position.z -= 5;
                    mod.position.x += 7 * n - 20;
                    mod.position.y = (i * 1) - 10;
                    // mod.rotation.y += elapsedTime * .5;
                    mod.scale.set(0.5, 0.5, 0.5)

                    scene.add(mod);
                },
                // called while loading is progressing
                function(xhr) {
                    console.log((xhr.loaded / xhr.total * 100) + '% 3D model loaded');
                },
                // called when loading has errors
                function(error) {
                    alert('error');
                    console.log('An error happened????');

                });


            ///


        }
    }
}

function onWindowResize() {
    //Size 
    window.addEventListener('resize', () => {
        // Update sizes
        sizes.width = window.innerWidth
        sizes.height = window.innerHeight

        // Update camera
        camera.aspect = sizes.width / sizes.height
        camera.updateProjectionMatrix()

        // Update renderer
        renderer.setSize(sizes.width, sizes.height)
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    })

    render();
}

function render() {
    renderer.render(scene, camera);
}


const raycaster = new THREE.Raycaster()

document.addEventListener('wheel', onMouseWheel)

let mouseX = 0;
let mouseY = 0;
let targetX = 0;
let targetY = 0;
let windowX = window.innerWidth / 4;
let windowY = window.innerHeight / 4;

function onMouseWheel(event) {
    // mouseX = (event.clientX - windowX)
    // mouseY = (event.clientY - windowY)
    mouseY = event.deltaY * 0.01;
    console.log(mouseY);
}

const mouse = new THREE.Vector2()
document.addEventListener('mousemove', onMouseMove)

function onMouseMove(event) {
    mouse.x = (event.clientX / sizes.width) * 2 - 1
    mouse.y = (event.clientY / sizes.height) * 2 - 1
}

function tick() {
    // if (camera.position.z > 0) {
    //     camera.position.z -= 0.05;
    // }
    targetX = mouseX * 0.01;
    targetY = mouseY * 0.01;

    const delta = clock.getDelta() //delta has to be initialized before elapsedTime

    // Update objects
    // sphere.rotation.y = .5 * elapsedTime
    // sphere.rotation.y += .5 * (targetY - sphere.rotation.y)
    // sphere.position.z += (window.scrollY * 100 - sphere.position.z)

    //Camera position
    // camera.rotation.y += .0005 * posZ;

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()

//get navbar
// let navs = [...document.getElementsByClassName('nav')];
// console.log('NAVS', navs);
// navs.forEach((nav, i) => {
//     let m = new THREE.MeshBasicMaterial();
//     m.color = new THREE.Color(0xffffff)
//         // m.texture = new THREE.Texture(nav);
//     let g = new THREE.PlaneBufferGeometry(1.5, 1);
//     let msh = new THREE.Mesh(g, m)
//     scene.add(msh)

//     msh.position.y = i * 1.2;

// })

// JS
let speed = 0;
let pos = 0;
let rounded = 0;
// let elems = [...document.querySelectorAll('.n')];

window.addEventListener('wheel', (e) => {
    // console.log(e);
    speed += e.deltaY * 0.002;
});

function raf() {
    speed *= 0.008;
    pos += speed;

    camera.position.x += pos;


    window.requestAnimationFrame(raf);
}

raf();

function gui() {
    // Debug
    const gui = new dat.GUI()
        // let modelFolder = gui.addFolder('3DModel')
        // modelFolder.add(mod.position, 'z', 0, Math.PI * 2)
        // modelFolder.open()
    let camFolder = gui.addFolder('Camera')
    camFolder.add(camera.position, 'x', -20, 20).listen();
    camFolder.add(camera.position, 'y', -20, 20).listen();
    camFolder.add(camera.position, 'z', -20, 20).listen();
    camFolder.add(camera.rotation, 'y', -20, 20).listen();

    console.log('Camera folder is added')
    camFolder.open()

    let animFolder = gui.addFolder('Anim')
        // animFolder.add(gt, 'x', 0, 10).listen();
        // animFolder.open()
}

gui();

function allItemsLoaded() {
    $('.onepix-imgloader').fadeOut();
    // fade in content (using opacity instead of fadein() so it retains it's height.
    $('.loading-container > *:not(.onepix-imgloader)').fadeTo(8000, 100);
}