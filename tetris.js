var board = new Array(110);
var presentmino;
var presentkaiten;

function makeboard(){
	for (var i=0;i<board.length;i++){
		board[i]=0;
	}
}
var presentp =4;
var tm=[[9,10,11,20],[0,9,10,20],[0,9,10,11],[0,10,11,20],[9,10,11,20]];//Tミノ
var om=[[0,1,10,11],[0,1,10,11],[0,1,10,11],[0,1,10,11],[0,1,10,11]];//Oミノ
var jm=[[0,10,11,12],[0,1,10,20],[0,1,2,12],[-9,1,10,11],[0,10,11,12]];//J
var lm=[[0,1,2,10],[0,1,11,21],[1,9,10,11],[0,10,20,21],[0,1,2,10]];//L
var sm=[[0,1,10,9],[-10,0,1,11],[0,1,10,9],[-10,0,1,11],[0,1,10,9]];//S
var zm=[[0,1,11,12],[-9,0,1,10],[0,1,11,12],[-9,0,1,10],[0,1,11,12]];//Z
var im=[[0,1,2,3],[-19,-9,1,11],[-10,-9,-8,-7],[-18,-8,2,12],[0,1,2,3]];//I

var tmino=[tm,om,jm,lm,sm,zm,im]

makeboard();

window.addEventListener("DOMContentLoaded",function(){//文字表示
	var squares=document.getElementsByClassName("square");
setTimeout("down()",500)
	appear();
},false);

window.addEventListener("keydown",KeyDownFunc);//キーボード制御↓
function KeyDownFunc(e){
var code = e.keyCode;

	switch (code){
		case 39:
			if (judgeidou(0) == true){ //右判定がtrue
				for (var i=0;i<4;i++){
					board[presentp+tmino[presentmino][presentkaiten][i]]=0;		
				}
				for (var i=0;i<4;i++){
					board[presentp+tmino[presentmino][presentkaiten][i]+1]=1;		
				}
				presentp = presentp+1;
			}
			break;
		case 37:
			if (judgeidou(1) == true){
				for (var i=0;i<4;i++){				
					board[presentp+tmino[presentmino][presentkaiten][i]]=0;		
				}
				for (var i=0;i<4;i++){
					board[presentp+tmino[presentmino][presentkaiten][i]-1]=1;		
				}
				presentp = presentp-1;				
			}
			break;
		case 38://ハードドロップ
			while (judgeidou(2) == true){				
				for (var i=0;i<4;i++){				
					board[presentp+tmino[presentmino][presentkaiten][i]]=0;	
				}
				for (var i=0;i<4;i++){
					board[presentp+tmino[presentmino][presentkaiten][i]+10]=1;		
				}
				presentp = presentp+10;	
				console.log(presentp);
			}
			break;
		case 32:
			kaiten();
			break;
	}
boardtohtml();
}													//↑	
function down(){
	var kj = judgeidou(2);
	if (kj == true){
		for (var i=0;i<4;i++){				
			board[presentp+tmino[presentmino][presentkaiten][i]]=0;	
		}
		for (var i=0;i<4;i++){
			board[presentp+tmino[presentmino][presentkaiten][i]+10]=1;		
		}
		presentp = presentp+10;				
	}	
boardtohtml();
setTimeout("down()",500);
}
function judgeidou(p){//移動可能か調べる
	var existsq = new Array(); 
	var falsem = 0;//移動できないマス数
	for (var i=0;i<board.length;i++){//移動中のマスを特定
		if (board[i] == 1){
			existsq.push(i);
		}
	}
	if (p == 0){//右判定
		for (i=0;i<existsq.length;i++){
			if (((existsq[i]+1)%10 == 9)||(board[existsq[i]+1] == 2)){//移動中マスの一つ右が壁or firm
				falsem++;
			}
		}
	}
	if (p == 1){//左判定
		for (i=0;i<existsq.length;i++){
			if (((existsq[i]-1)%10 == 0)||(board[existsq[i]-1] == 2)){//移動中マスの一つ左が壁or firm
				falsem++;
			}
		}
	}
	if (p == 2){//下判定
	//console.log("下判定開始しますっ！");
		for (i=0;i<existsq.length;i++){
			if (((existsq[i]+10) >= 99)||(board[existsq[i]+10] == 2)){//移動中マスの一つ下が壁or firm
				falsem++;
			}
		}
	}	
	if (falsem == 0){
		return true;
	}else{
		if (p ==2){
			
			for (var i=0;i<4;i++){
				board[existsq[i]] = 2;
			}
			for (var i=1;i<9;i++){
				if (board[i] == 2){
					gameover();
				}else{
					erase();//消滅判定
					appear();
					presentp=4;
					falsem = 0;
					return false;
				}
			}

		}
	}
}
function gameover(){
boardtohtml();
alert("GAMEOVER");	
makeboard();
presentp = 4;
appear();
}
function kaiten(){//回転判定
	var falsem = 0;//移動できないマス数
	
	for (var i=0;i<4;i++){
			if ((board[presentp+tmino[presentmino][presentkaiten+1][i]] == 2)||((presentp+tmino[presentmino][presentkaiten+1][i])%10 == 9)||((presentp+tmino[presentmino][presentkaiten+1][i])%10 == 0)||((presentp+tmino[presentmino][presentkaiten+1][i])>=99)){//壁、床からはみ出たor回転先にブロックある時
			falsem++;
		}
	}
	if (falsem ==0){
		for (var i=0;i<4;i++){
			board[presentp+tmino[presentmino][presentkaiten][i]] = 0;
		}		
		for (var i=0;i<4;i++){
			board[presentp+tmino[presentmino][presentkaiten+1][i]] = 1;
		}
		presentkaiten++
		if (presentkaiten == 4){presentkaiten = 0;}
	}
}
function erase(){//消滅判定
boardtohtml();
	var soroi = 0;//n1から始め、n8まで蓄積されたら8となる
	for (var i=11;i<99;i++){
		if (board[i] == 2){
			soroi++;
			if (soroi == 8){//一行揃った	
				for (var j=0;j<8;j++){
					board[i-j]=0;//揃った列を消去
				}
				for (var j=0;j<=i;j++){
					board[i-j]=board[i-10-j];//一段下げ
				}
				for (var k=0;k<8;k++){
					board[11+k]=0;
				}
				boardtohtml();
			}
		}
		if (i%10 == 9){//一旦端に行ったら揃いを0に
			soroi=0;
		}
	}
}

function appear(){//テトリミノ表示
	var at = Math.floor(Math.random()*7);
	presentmino=at;
	presentkaiten=0;
	var presentp=4;
	var cnt = 0;
	for (var i=0;i<4;i++){
		if (board[presentp+tmino[at][0][i]] == 2){
			cnt++;
		}
	}
	
	if (cnt == 0){
		for (var i=0;i<4;i++){
			board[presentp+tmino[at][0][i]]=1;
		}
	}else{
		gameover();
	}
	boardtohtml()
}
function boardtohtml(){//情報をhtmlに反映
	for (var i=0;i<board.length;i++){
		if (i%10!=0&&i%10!=9&&i>10&&i<99){
			switch(board[i]){
				case 0:
					document.getElementById("s"+i).className='square none';
					break;
				case 1:
					document.getElementById("s"+i).className='square exist';
					break;
				case 2:
					document.getElementById("s"+i).className='square firm';
					break;
			}
		}
	}
}