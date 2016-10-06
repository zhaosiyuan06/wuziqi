//1.前面补0
function p(n){
    return n<10?'0'+n:n;
}
//定时器白
var whiteOne=1;
//定时器黑
var blackOne=1;
//2.倒计时
function getMyTime1(){
    var m=parseInt(whiteOne/60%60);
    var s=parseInt(whiteOne%60);
    document.getElementById('whiteTime').innerHTML=p(m)+':'+p(s);
    whiteOne=whiteOne+1;	
    if(whiteOne>=600){
        document.getElementById('time').innerHTML='游戏结束';
    }
}
//t1=setInterval('getMyTime1()',1000);


//2.倒计时
function getMyTime2(){
    var m=parseInt(blackOne/60%60);
    var s=parseInt(blackOne%60);
    document.getElementById('blackTime').innerHTML=p(m)+':'+p(s);
    blackOne=blackOne+1;	
    if(blackOne>=600){
        document.getElementById('blackTime').innerHTML='游戏结束';
    }
}
//t2=setInterval('getMyTime2()',1000);

$(function(){
    var canvas=$('#canvas').get(0)
    var ctx=canvas.getContext("2d");
    var wid=canvas.width;
    var NUM=15;
    var w=wid/NUM;
    var ai=false;
    var blank={};
    var ws=document.documentElement.clientWidth;
    var h=document.documentElement.clientHeight;
	var t1=1;
	var t2=1;
    for(var i=0;i<NUM;i++){
        for(var j=0;j<NUM;j++){
            blank[k3(i,j)]=true;
        }
    }
	var audio =document.getElementById("audio");
	audio.play();
  
    function draw(){
        //画行线
        function drawR(i){
            ctx.beginPath();
            // var startPoint={x:,y;};
            ctx.moveTo(w/2+0.5,w/2+0.5+(i)*w);
            ctx.lineTo((NUM-0.5)*w+0.5,w/2+0.5+(i)*w)
            ctx.stroke();
            ctx.closePath();
        }
        for(var i=0;i<NUM;i++){
            drawR(i)
        }
        //画竖线
        function drawW(i){
            ctx.beginPath();
            ctx.moveTo(w/2+0.5+(i)*w,w/2+0.5);
            ctx.lineTo(w/2+0.5+i*w,(NUM-0.5)*w+0.5)
            ctx.stroke();
            ctx.closePath();
        }
        for(var j=0;j<NUM;j++){
            drawW(j)
        }
        //画圆点5个
        function makeCircle(x,y){
            ctx.beginPath();
            ctx.arc(x*w,y*w,3,0,2*Math.PI)
            ctx.fill();
            ctx.closePath();
        }
        makeCircle(3.5,3.5)
        makeCircle(11.5,3.5)
        makeCircle(7.5,7.5)
        makeCircle(3.5,11.5)
        makeCircle(11.5,11.5)
    }
    draw();
    function k3(x,y) {
        return x+"_"+y;
    }
    //落子
    //棋子样式
    function v2k(position){
        return position.x+"_"+position.y;
    }
    function makeChess(position,color){
        ctx.save();
        ctx.beginPath();
        ctx.translate((position.x+0.5)*w,(position.y+0.5)*w)
        if(color==='black'){
            var s=ctx.createRadialGradient(-3,1,2,0,0,15);
            s.addColorStop(0,'#aaa');
            s.addColorStop(0.3,'#666');
            s.addColorStop(1,'#333');
            ctx.fillStyle=s;
            t1=setInterval('getMyTime1()',1000);
			clearInterval(t2);
			blackOne=1;
			document.getElementById('blackTime').innerHTML="00:00";
			

        }else{
            var b=ctx.createRadialGradient(-3,1,2,0,0,15);
            b.addColorStop(0,'#fff');
            b.addColorStop(1,'#ccc');
            ctx.fillStyle=b;
            ctx.shadowOffsetX=2;
            ctx.shadowOffsetY=2;
            ctx.shadowBlur=2;
            ctx.shadowColor='#ddd';
            t2=setInterval('getMyTime2()',1000);
			clearInterval(t1);
			whiteOne=1;
			document.getElementById('whiteTime').innerHTML="00:00";

        }
        ctx.arc(0,0,15,0,2*Math.PI)
        ctx.fill();
        ctx.closePath();
        ctx.restore();
        blocks[v2k(position)]=color;
        delete blank[v2k(position)];

    }

    //生成棋谱
    function keys(key){//
        var arr=key.split("_");
        return {x:parseInt(arr[0]),y:parseInt(arr[1])}//将“1_1”截取为{x:1,y:1},返回给review函数；
    }
    function drawText(pos,text,color){//生成棋谱的数字
        ctx.save();
        ctx.font="20px 微软雅黑";
        ctx.textAlign="center";
        ctx.textBaseline="middle";
        if(color=="black"){
            ctx.fillStyle="white";
        }else if(color=='white'){
            ctx.fillStyle="black";
        }
        ctx.fillText(text,(0.5+pos.x)*w,(0.5+pos.y)*w);
        ctx.restore();
    }
    function review(){
        var i=1;
        for(var s in blocks){//blocks是个json，
            drawText(keys(s),i,blocks[s]);//blocks[s]获取到Json健值
            i++;
        }
    }
    //生成棋谱结束
    //
    function check(pos,color){
        var numR=1;
        var numC=1;
        var numZ=1;
        var numX=1;
        var table={};
        for(var i in blocks){
            if(blocks[i]==color){
                table[i]=true;
            }
        }
        //判断横向是否连成5个

        var tx=pos.x;
        var ty=pos.y;
        while(table[k3(tx+1,ty)]){ numR++; tx++;}
        tx=pos.x;ty=pos.y;
        while(table[k3(tx-1,ty)]){ numR++; tx--;}
        //判断纵向是否连成5个
        while(table[k3(tx,ty+1)]){ numC++; ty++;}
        tx=pos.x;ty=pos.y;
        while(table[k3(tx,ty-1)]){ numR++; ty--;}
        //判断斜着是否连成5个
        while(table[k3(tx+1,ty+1)]){ numZ++; ty++;tx++;}
        tx=pos.x;ty=pos.y;
        while(table[k3(tx-1,ty-1)]){ numZ++; ty--;tx--}

        while(table[k3(tx+1,ty-1)]){ numX++; ty--;tx++;}
        tx=pos.x;ty=pos.y;
        while(table[k3(tx-1,ty+1)]){ numX++; ty++;tx--}
        return Math.max(numC,numR,numZ,numX);
        // return numC>=5||numR>=5||numZ>=5||numX>=5;
    }
    var flag=true;
    var blocks={};
    function AI(){
        var max1=-Infinity;
        var max2=-Infinity;
        var pos1;
        var pos2;
        for(var i in blank){
            var score1=check(keys(i),'black');
            var score2=check(keys(i),'white');
            if(score1>max1){
                max1=score1;
                pos1=keys(i);
            }
            if(score2>max2){
                max2=score2;
                pos2=keys(i);
            }
        }
        if(max2>max1){
            return pos2;
        }else{
            return pos1;
        }
    }
	//游戏开始
	function gameStart(){
      
		//默认游戏开始时黑子先手，先从黑子开始计时
		t2=setInterval('getMyTime2()',1000);
	}
    function resertStart(){
        ctx.clearRect(0,0,wid,wid);
        blocks={};
        flag=true;
        $(canvas).off('click').on('click',handlekeyDown);
        draw();
        $('.tisi').css({opacity:1});
		//点击重新开始，重新开始计时
		whiteOne=1;
		blackOne=1;
		clearInterval(t1);
		clearInterval(t2);
		document.getElementById('whiteTime').innerHTML="00:00";
		document.getElementById('blackTime').innerHTML="00:00";
		//
		

    }
    function handlekeyDown(e){
		
       
		var audioa=document.getElementById('audioa');
		audioa.play();
        var position={
            x:Math.round((e.offsetX-w/2)/w),
            y:Math.round((e.offsetY-w/2)/w)
        };
        if(blocks[v2k(position)]){
            return;
        }
        if(ai){
            makeChess(position,"black");
            if(check(position,'black')>=5){
                $('.alerta').removeClass('.alerta').addClass('alertaa')
                // alert('黑棋赢了！');
			//赢的时侯清除计时，从零开始	
			whiteOne=1;
			blackOne=1;
			clearInterval(t1);
			clearInterval(t2);
			document.getElementById('whiteTime').innerHTML="00:00";
			document.getElementById('blackTime').innerHTML="00:00";
			//	
                $('canvas').off('click');
                $('.sheng').on('click',function(){
                    review();
                })
                return;
            }
            makeChess(AI(),"white");
            if(check(AI(),'white')>=5){
                //赢的时侯清除计时，从零开始
			whiteOne=1;
			blackOne=1;
			clearInterval(t1);
			clearInterval(t2);
			document.getElementById('whiteTime').innerHTML="00:00";
			document.getElementById('blackTime').innerHTML="00:00";
			//	
                $('.alerts').removeClass('.alerts').addClass('alertss')
                $('canvas').off('click');
                $('.sheng').on('click',function(){
                    review();
                })
                // if(confirm("是否生成棋谱？")){
                //     review();
                // }
                return;
            }
            return;
        }

        if(flag){
            makeChess(position,'black');
            if(check(position,'black')>=5){
                $('.alerta').removeClass('.alerta').addClass('alertaa')
                // alert('黑棋赢了！');
               //赢的时侯清除计时，从零开始	
			whiteOne=1;
			blackOne=1;
			clearInterval(t1);
			clearInterval(t2);
			document.getElementById('whiteTime').innerHTML="00:00";
			document.getElementById('blackTime').innerHTML="00:00";
                $('canvas').off('click');
                $('.sheng').on('click',function(){
                    review();
                })
                return;
            }
        }else{
            makeChess(position,'white');
            if(check(position,'white')>=5){
                $('.alerts').removeClass('.alerts').addClass('alertss')
                // alert('白棋赢了！');
				//赢的时侯清除计时，从零开始	
			whiteOne=1;
			blackOne=1;
			clearInterval(t1);
			clearInterval(t2);
			document.getElementById('whiteTime').innerHTML="00:00";
			document.getElementById('blackTime').innerHTML="00:00";
			//	
                $('canvas').off('click');
                // $('.sheng').on('click',false);
                $('.sheng').on('click',function(){
                    review();
                })
                return;
            }
        }
        flag=!flag;
    }
    $(".start").on('click',resertStart);
	//新增重新开始
	$(".blackStart").on('click',gameStart);
    $(canvas).on('click',handlekeyDown);
    $('#renji').on('click',function(){
        $(this).toggleClass('active');
        ai=!ai;
    })

    $('.alerts').on('click',function(){
        $(this).removeClass('alertss')
    })
    $('.alerta').on('click',function(){
        $(this).removeClass('alertaa')
    })

    $('#mode').on('click',function () {
        $('ul').slideToggle();
    })
    $('#start').on('click',function () {
        draw();
    })

    // $('#restart').on('click',restart);

    $('ul li input').on('click',function () {
        var text=$(this).closest('span').text();
        console.log(text)
        $('#mode div').text(text);
        $('ul').hide()
    })
    var conflag=true;
$('.guize').on('click',function(){
    if(conflag){
        $('.content').css('display','block');
        conflag=false;
    }else{
        $('.content').css('display','none');
         conflag=true;

    }

})
   

})