$(document).ready(function(){

	var camera, scene, renderer;
  var effect, controls;
  var element, container;
  var cube, cubeVelocity = -1;
  var loader;

  var clock = new THREE.Clock();

  init();
  animate();

  function init() {

    //*** Loader ***
    loader = new THREE.JSONLoader(); // init the loader util

    //*** Renderer ***
    renderer = new THREE.WebGLRenderer();
    renderer.shadowMapEnabled = true;
    renderer.shadowMapSoft = true;

    element = renderer.domElement;
    container = document.getElementById('example');
    container.appendChild(element);
    effect = new THREE.StereoEffect(renderer);

    //*** Scene ***
    scene = new THREE.Scene();

    //*** Camera ***
    camera = new THREE.PerspectiveCamera(90, 1, 1, 100000);
    camera.position.set(-1200, 500, 0);
    camera.lookAt(new THREE.Vector3(1, 50, 0));
    scene.add(camera);

    //*** Light ***
    // var ambilight = new THREE.AmbientLight( 0x404040 ); // soft white light
    // scene.add( ambilight );

    var hemilight = new THREE.HemisphereLight(0x777777, 0x000000, 0.6);
    scene.add(hemilight);

    // var plight = new THREE.PointLight( 0xff0000, 1, 10, 1);
    // plight.position.set( 50, 15, 0 );
    // scene.add( plight );

    light = new THREE.DirectionalLight(0xdfebff, 0.1);
    light.position.set(300, 400, 50);
    light.position.multiplyScalar(1.3);

    light.castShadow = true;
    light.onlyShadow=true;

    light.shadowMapWidth = 512;
    light.shadowMapHeight = 512;

    var d = 200;

    light.shadowCameraLeft = -d;
    light.shadowCameraRight = d;
    light.shadowCameraTop = d;
    light.shadowCameraBottom = -d;

    light.shadowCameraFar = 1000;
    light.shadowDarkness = 0.5;

    scene.add( light );

    //*** Controls ***
    window.addEventListener('deviceorientation', setOrientationControls, true);

    //orbit controls
    controls = new THREE.OrbitControls(camera, element);
    controls.rotateUp(Math.PI / 4);
    controls.target.set(
      camera.position.x + 0.1,
      camera.position.y,
      camera.position.z
    );
    controls.noZoom = true;
    controls.noPan = true;

    //orientation controls
    function setOrientationControls(e) {
      if (!e.alpha) {
        window.removeEventListener('deviceorientation', setOrientationControls, true);
        return;
      }

      controls = new THREE.DeviceOrientationControls(camera, true);
      controls.connect();
      controls.update();

      element.addEventListener('click', fullscreen, false);

      window.removeEventListener('deviceorientation', setOrientationControls, true);
    }
    
    //*** OBJECTS ***

    //*** Ground Plane ***

    //texture 
    var texture = THREE.ImageUtils.loadTexture(
      'textures/patterns/checker.png'
    );
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat = new THREE.Vector2(50, 50);
    texture.anisotropy = renderer.getMaxAnisotropy();
    //material
    var material = new THREE.MeshPhongMaterial({
      color: 0xffffff,
      specular: 0xffffff,
      shininess: 20,
      shading: THREE.FlatShading,
      map: texture
    });

    //geometry
    var geometry = new THREE.PlaneGeometry(2000, 2000);

    //mesh
    var mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.x = -Math.PI / 2;
    mesh.receiveShadow = true;
    scene.add(mesh);

    //*** Test Objects ***
    var cubeGeo = new THREE.BoxGeometry( 50, 50, 50 );
    var cubeMaterial = new THREE.MeshPhongMaterial({
      color: 0x00ff00,
      specular: 0x00ff00,
      shininess: 10,
      shading: THREE.FlatShading
    });
    cube = new THREE.Mesh( cubeGeo, cubeMaterial );
    cube.position.set(100, 1000, 0);
    cube.castShadow = true;
    scene.add( cube );

    // init loading
    loader.load('outfile.js', function (geometry) {
      // create a new material
      var material = new THREE.MeshLambertMaterial({
        color: 0xFFFFFF,
        specular: 0xFFFFFF,
        shininess: 10,
        shading: THREE.FlatShading,
        // map: THREE.ImageUtils.loadTexture('path_to_texture'),  // specify and load the texture
        // colorAmbient: [0.480000026226044, 0.480000026226044, 0.480000026226044],
        // colorDiffuse: [0.480000026226044, 0.480000026226044, 0.480000026226044],
        // colorSpecular: [0.8999999761581421, 0.8999999761581421, 0.8999999761581421],
      });
      
      // create a mesh with models geometry and material
      var mesh = new THREE.Mesh(
        geometry,
        material
      );
      
      mesh.position.set(10, 100, 0);
      mesh.rotation.y = -Math.PI/5;
      
      scene.add(mesh);
    });


    //window resizing
    window.addEventListener('resize', resize, false);
    setTimeout(resize, 1);
  }

  function resize() {
    var width = container.offsetWidth;
    var height = container.offsetHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setSize(width, height);
    effect.setSize(width, height);
  }

  function update(dt) {
    resize();

    //update objects
    cube.rotation.x += 0.1;
    cube.rotation.y += 0.1;
    cube.position.y += cubeVelocity;
    if(cube.position.y < 900 || cube.position.y+25 > 1100){
      cubeVelocity *= -1;
    }

    camera.updateProjectionMatrix();
    controls.update(dt);
  }

  function render(dt) {
    effect.render(scene, camera);
  }

  function animate(t) {
    requestAnimationFrame(animate);

    update(clock.getDelta());
    render(clock.getDelta());
  }

  function fullscreen() {
    if (container.requestFullscreen) {
      container.requestFullscreen();
    } else if (container.msRequestFullscreen) {
      container.msRequestFullscreen();
    } else if (container.mozRequestFullScreen) {
      container.mozRequestFullScreen();
    } else if (container.webkitRequestFullscreen) {
      container.webkitRequestFullscreen();
    }
  }

});

