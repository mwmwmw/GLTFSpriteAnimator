var avatar = "assets/Matthew.glb";
var clock = new THREE.Clock();
var renderer = new THREE.WebGLRenderer({ antialias: false });

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 2000);
camera.position.set(0, 0, 3);

var scene = new THREE.Scene();
var controls = new THREE.OrbitControls(camera);

var mixer = null;
scene.add(camera);

document.body.append(renderer.domElement);

var loader = new THREE.GLTFLoader();
loader.load(avatar, function (gltf) {
	gltf.scene.traverse(function (child) {
		if (child.material) {
			var material = new THREE.MeshBasicMaterial();
			material.map = child.material.map;
			material.alphaTest = 0.5;
			material.skinning = true;
			material.side = THREE.DoubleSide;
			child.material = material;
			child.material.needsUpdate = true;
		}
	});

	scene.add(gltf.scene);

	if (gltf.animations && gltf.animations.length) {
		mixer = new THREE.AnimationMixer(gltf.scene);
		for (var i = 0; i < gltf.animations.length; i++) {
			var animation = gltf.animations[i];
			mixer.clipAction(animation).play();
		}
	}
}, function (xhr) {
	//console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
}, function (error) {
	console.log(error);
});

function animate() {
	requestAnimationFrame(animate);
	controls.update();
	if (mixer) {
		mixer.update(clock.getDelta() * mixer.timeScale);
	}
	renderer.render(scene, camera);
}
animate();

function resize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener("resize", resize);