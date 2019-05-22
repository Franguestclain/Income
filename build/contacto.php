<?php
	function validar_campo($campo){
		$campo = stripcslashes($campo);
		$campo = htmlspecialchars($campo);


		return $campo;
	}


		header('location: index.html');

		if (isset($_POST['submit-contacto']) && isset($_POST['nombre']) && !empty($_POST['nombre']) &&
			isset($_POST['correo']) && !empty($_POST['correo']) &&
			isset($_POST['telefono']) && !empty($_POST['telefono']) &&
			isset($_POST['msg']) && !empty($_POST['msg'])){

			$destinoMail = 'the_king_00carlos@hotmail.com';
			
			$nombre = validar_campo($_POST['nombre']);
			$correo = validar_campo($_POST['correo']);
			$tel = validar_campo($_POST['telefono']);
			$msg = validar_campo($_POST['msg']);
			$headers = 'From:'.$correo. "\r\n";
			$headers = 'Reply-To: '.$destinoMail. "\r\n";
			$headers =  'X-mailer: PHP/'.phpversion();

			
			$contenido = "Nombre: ".$nombre."\n Telefono: ".$tel."\n Email: ".$correo."\n Mensaje: ".$msg;

			mail($destinoMail, "Mensaje de contacto", $contenido, $headers);
			// return print(json_encode('ok'));

		}
		// return print(json_encode('No'));