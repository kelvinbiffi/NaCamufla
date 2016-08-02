<?php
header("Content-type: text/javascript; charset=iso-8859-1");
$resp = '';
require_once 'functions.php';
$f = new functions();
if(isset($_REQUEST['action']) && isset($_REQUEST['chatId'])){
	//Create a new chat
	if($_REQUEST['action'] == 'createChat'){
		if(isset($_REQUEST['ownerNick']) && isset($_REQUEST['dateExpiration']) && isset($_REQUEST['howMuchKeep'])){
			$resp = $f->createChat($_REQUEST['chatId'],$_REQUEST['ownerNick'],$_REQUEST['ownerCode'],$_REQUEST['dateExpiration'],$_REQUEST['howMuchKeep']);
		}else{
			$resp = array('error' => 'An error occurred in the creation of chat.');
		}
	}else if(isset($_REQUEST['participantCode'])){
		//Add a new participant to the chat
		if($_REQUEST['action'] == 'enterInChat' && $_REQUEST['participantNick'] != ''){
			$resp = $f->enterInChat($_REQUEST['chatId'], $_REQUEST['participantCode'], $_REQUEST['participantNick']);
		}
		//Return the chat messages
		else if($_REQUEST['action'] == 'returnChat'){
			$resp = $f->returnChat($_REQUEST['chatId'],$_REQUEST['participantCode']);
		}
		//Add a new message to the chat
		else if($_REQUEST['action'] == 'sendMsg' && isset($_REQUEST['msg'])){
			$resp = $f->sendMsg($_REQUEST['chatId'],$_REQUEST['participantCode'],$_REQUEST['msg']);
		}
		//Remove a participant from the chat
		else if($_REQUEST['action'] == 'leaveChat'){
			$f->leaveChat($_REQUEST['chatId'],$_REQUEST['participantCode'], $_REQUEST['participantNick']);
		}
	}
//Generate a code that can be used as a participant id or chat id
}else if(isset($_REQUEST['action']) && $_REQUEST['action'] == 'generateCode'){
	$resp = $f->generateCode();
}
echo json_encode($resp);
