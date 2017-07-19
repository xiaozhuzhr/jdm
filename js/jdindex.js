//页面加载之后触发的事件
window.onload = function(){
	// alert('111');
	//调用通栏的效果
	headerScoll();
	//调用倒计时
	cutDomTime();
	//轮播图
	// banner3();
	//touch
	touch();

}
/*
	必须知道的值：
	1.导航栏距离顶点的高度
	2.顶部通栏距离顶点的位置
 */
//通栏
function headerScoll(){
	//1.获取导航栏对象
	var navDom = document.querySelector('.jd_nav');
	//2.导航栏距离顶点的高度
	var top = navDom.offsetTop;//距离顶部的高度
	var height = navDom.offsetHeight;//节点自身高度
	// console.log(top);
	// console.log(height);	
	var maxDistance = navDom.offsetTop;
	//3.获取顶部通栏
	var headerDom = document.querySelector('.jd_header');
	// 4.添加一个onscroll滚动事件
	window.onscroll = function(){
		// console.log("aaa");
		var scollDistance = window.document.body.scrollTop;
		console.log(scollDistance);
		//如果滚动距离/maxDistance>1 表示超出轮播图->背景实心
		var percent = scollDistance/maxDistance;
		if(percent>1){
			percent = 1;
		}
		//将通栏背景设为percent
		headerDom.style.backgroundColor = 'rgba(201,21,35,'+percent+')';
	}	
}

//2.倒计时
function cutDomTime(){
	//剩余总时间(s)
	var totalSec = 3600;
	//获取存放显示时间的li
	var liArr = document.querySelectorAll('.main_content:nth-child(1) .content_top li');
	// console.log(liArr);
	//开始倒计时
	var timeId = setInterval(function(){
		//判断如果倒计时已经小于等于0  结束倒计时
		if(totalSec<=0){
			clearInterval(timeId);
			return;
		}
		//秒数减一
		totalSec--;

		// 将当前总秒数换算成时；分：秒
		// 计算当前秒是多少小时  Math.floor（totalSec/3600）
		var hour = Math.floor(totalSec/3600);
		//分别取小时的十位和个位   Math.floor(hour/10) hour%10
		
		//计算分钟
		var min = Math.floor(totalSec%3600/60);
		//计算秒
		var sec = totalSec%60;
		
		// 将换算的数字放到页面对应的li中
		liArr[0].innerHTML = Math.floor(hour/10);liArr[1].innerHTML = hour%10;
		liArr[3].innerHTML = Math.floor(min/10);liArr[4].innerHTML = min%10;
		liArr[6].innerHTML = Math.floor(sec/10);liArr[7].innerHTML = sec%10;
		
	},1000);
}

function touch(){
	/*
		必须记录的值：
		1.定义index记录索引值
		2.轮播图每个图片宽度
		  整个轮播图的ul
		  索引ul li
	 */
	//1.记录屏幕宽度
	var width = document.body.offsetWidth;
	//2.获取所有轮播图的ul节点
	var moveUl = document.querySelector('.banner_images');
	
	//3.定义一个index记录当前的索引值
	var index = 1;
	//4.表示索引的li标签
	var indexLiArr = document.querySelectorAll(".banner_index li");
	//5.自动轮播  一秒切一张图
	var time1 = setInterval(function(){
		//下一张
		index++;
		moveUl.style.transition = "all 0.5s";//0.5秒过渡动画
		// if(index>=9){
		// 	index = 1;
		// 	//瞬间回到第一张
		// 	moveUl.style.transition = "";
		// }
		//修改ul的位置  css3的属性 translateX:在x轴上移动  不会影响其他元素
		moveUl.style.transform = 'translateX('+index*width*-1+'px)'
		
	},1000);
	//每次过渡结束(轮播一张图结束)
	//判断是否到了最后一张
	//如果是，则立刻跳到第一张
	moveUl.addEventListener("webkitTransitionEnd",function(){ 
		if (index>=9) {
			index = 1;
			//关闭过渡
			moveUl.style.transition = '';
			//修改ul位置
			moveUl.style.transform = 'translateX('+index*width*-1+'px)';
		}else if(index<1){
			//即将空白 立刻回到倒数第二张
			index = 8;
			//关闭过渡
			moveUl.style.transition = '';
			//修改ul位置
			moveUl.style.transform = 'translateX('+index*width*-1+'px)';
		}
		//根据当前图片下标修改索引的背景颜色(白色)
		//清空所有小圆点
		for(var i = 0;i<indexLiArr.length;i++){
			indexLiArr[i].className = '';
		};
		//当前位置的li变成实心
		indexLiArr[index-1].className = 'current';
	});	
	var startX = 0;
	var distanceX = 0;
	//手指滑动效果
	//1.查找节点
	moveUl.addEventListener('touchstart',function(event){
		//1.关闭自动轮播 和过渡效果
		clearInterval(time1);
		moveUl.style.transition = '';
		//2.获取按下时的横坐标
		startX = event.touches[0].clientX;
	});
	//滑动
	moveUl.addEventListener('touchmove',function(event){
		//计算移动的值
		distanceX = event.touches[0].clientX - startX;
		var tranX = index*width*-1+distanceX;
		//实时更新图片位置
		moveUl.style.transform = 'translateX('+tranX+'px)';
	});
	//滑动结束
	moveUl.addEventListener('touchend',function(event){
		//想切图要移动最小距离是整个屏幕的1/3
		var minDistance = width/3;
		//判断移动的距离是否大于width/3
		if(Math.abs(distanceX)>=minDistance){
			//根据distance的正负判断index++还是index--
			if(distanceX<0){
				//切换图片 index++
				index++;
			}else{
				index--;
			}
			
			moveUl.style.transition = 'all 0.5s';
			moveUl.style.transform = 'translateX('+index*width*-1+'px)';
		}else{
			//回退到当前图
			moveUl.style.transition = 'all 0.5s';
			moveUl.style.transform = 'translateX('+index*width*-1+'px)';	
		}
		// 开启定时器
		time1 = setInterval(function(){
		//下一张
		index++;
		moveUl.style.transition = "all 0.5s";//0.5秒过渡动画
		// if(index>=9){
		// 	index = 1;
		// 	//瞬间回到第一张
		// 	moveUl.style.transition = "";
		// }
		//修改ul的位置  css3的属性 translateX:在x轴上移动  不会影响其他元素
		moveUl.style.transform = 'translateX('+index*width*-1+'px)'
		
		},1000);

	});
	
}