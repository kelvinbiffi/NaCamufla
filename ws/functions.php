<?php
class functions{
	/**
	 * Create a new chat
	 * @param $chatId this parameter is the chat id
	 * @param $ownerNick this parameter is the nick of who create/the first participant of the chat
	 * @param $ownerCode this parameter is the code of who create/the first participant of the chat
	 * @param $dateExpiration this parameter is the number of hours where the chat will be available
	 * @param $howMuchKeep This parameter tells how many messages can be kept on the chat file
	 * @param $ownerLeaveDelChat if this parameter is true when the owner of the chat leave, this chat will be deleted
	 * @return string[]
	 */
	function createChat($chatId,$ownerNick,$ownerCode,$dateExpiration,$howMuchKeep,$ownerLeaveDelChat = "true"){
		$resp = file_get_contents("../chat/".$chatId.".json");
		if($resp == false){
			$date = date('d-m-Y H:i');
			$dateExpiration = date('d-m-Y H:i', strtotime("+".$dateExpiration." hours",strtotime($date)));
			$a = fopen("../chat/".$chatId.".json","a");
			$jsonBase = '{"chat":{"code":"'.$chatId.'","ownerLeaveDelChat":'.$ownerLeaveDelChat.',"dateExpiration":"'.$dateExpiration.'","howMuchKeep":"'.$howMuchKeep.'",
				"participants":{"0":{"code":"'.$ownerCode.'","nick":"'.$ownerNick.'","owner":true}},
				"msg":[{"nick":"Chatter","msg":"Welcome to new room!"}]}}';
			$c = fwrite($a, $jsonBase);
			fclose($a);
		}else{
			$c = true;
		}

		if($c != false){
			return array('response'=>'OK');
		}else{
			return array('error'=>'Error on file creation!');
		}
	}

	/**
	 * This function delete the chat archive where name equal $chatId.
	 * @param $chatId
	 */
	function deleteChat($chatId){
		unlink("../chat/".$chatId.".json");
	}

	/**
	 * Return the chat messages and the nick of who send that message
	 * @param unknown $chatId
	 * @param unknown $participantCode
	 * @return string[]|mixed
	 */
	function returnChat($chatId,$participantCode){
		$resp = file_get_contents("../chat/".$chatId.".json");
		if($resp == false){
			return array('error'=>'This chat does not exist');
		}else{
			$file = json_decode($resp,true);
			foreach($file['chat']['participants'] as $p){
				if($p['code'] == $participantCode){
					return $file['chat']['msg'];
				}
			}
			return array('error'=>'You are not in this chat!');
		}
	}

	/**
	 * This function add a participant into the chat
	 * @param $chatId
	 * @param $participantCode
	 * @param $participantNick
	 * @return string[]
	 */
	function enterInChat($chatId, $participantCode, $participantNick){
		$file = file_get_contents("../chat/".$chatId.".json");
		if($file == false){
			$file = array('error'=>'This chat does not exist');
		}else{
			$file = json_decode($file,true);
			foreach($file['chat']['participants'] as $p){
				if($p['code'] == $participantCode){
					return array('response'=>'OK');
				}
			}
			$file['chat']['participants'][count($file['chat']['participants'])] = array("code"=>$participantCode,"nick"=>$participantNick, "owner"=>false);
			$this->deleteChat($chatId);
			$a = fopen("../chat/".$chatId.".json","a");
			$c = fwrite($a, json_encode($file));
			fclose($a);
			if($c != false){
				return array('response'=>'OK');
			}else{
				return array('error'=>'Error on file creation!');
			}
		}
	}

	/**
	 * Generate the code used as participant id and chat id.
	 * @return string[]
	 */
	function generateCode(){
		return array('idGenerated'=>date('sz').rand(0,9).rand(0,9).rand(0,9).rand(0,9).rand(0,9).rand(0,9));
	}


	/**
	 * Add/Send a message in the chat
	 * @param unknown $chatId
	 * @param unknown $participantCode
	 * @param unknown $msg
	 * @return string[]
	 */
	function sendMsg($chatId,$participantCode,$msg){
		$file = file_get_contents("../chat/".$chatId.".json");
		if($file == false){
			$file = array('error'=>'This chat does not exist');
		}else{
			$file = json_decode($file,true);
			foreach($file['chat']['participants'] as $p){
				if($p['code'] == $participantCode){
					if(empty($file['chat']['msg'])){
						$file['chat']['msg'] = array('0'=>array('nick'=>$p['nick'],'msg'=>$msg));
					}else{
						if(count($file['chat']['msg']) >= $file['chat']['howMuchKeep']
							&& $file['chat']['howMuchKeep'] > 0){// Add this condition if the processing of this get too much bigger && $file['chat']['howMuchKeep'] <= 5
							$hmkControl = 0;
							while($hmkControl < $file['chat']['howMuchKeep']){
								$receiver['msg'][$hmkControl] = $file['chat']['msg'][$hmkControl + 1];
								$hmkControl++;
							}
							$file['chat']['msg'] = $receiver['msg'];
						}
						$file['chat']['msg'][count($file['chat']['msg'])] = array('nick'=>$p['nick'],'msg'=>$msg);
					}
					$this->deleteChat($chatId);
					$a = fopen("../chat/".$chatId.".json","a");
					$c = fwrite($a, json_encode($file));
					fclose($a);
					if($c != false){
						return array('response'=>'OK');
					}else{
						return array('error'=>'Error on file creation!');
					}
				}
			}
			return array('error'=>'You are not in this chat!');
		}
	}

	/**
	 * Remove the participant from the chat
	 * @param $chatId
	 * @param $participantCode
	 */
	function leaveChat($chatId, $participantCode){
		$file = file_get_contents("../chat/".$chatId.".json");
		if($file == false){
			$file = array('error'=>'This chat does not exist');
		}else{
			$file = json_decode($file,true);
			$c = 0;
			$participants = array();
			$this->deleteChat($chatId);
			foreach($file['chat']['participants'] as $p){
				if($p['code'] == $participantCode && $file['chat']['ownerLeaveDelChat']){
					if($p['owner']){
						return;
					}
				}else{
					$participants[$c] = $p;
				}
				$c++;
			}
			$file['chat']['participants'] = $participants;
			$a = fopen("../chat/".$chatId.".json","a");
			$c = fwrite($a, json_encode($file));
			fclose($a);
		}
	}

}
