//测试用firefox 15
require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';
import ReactDOM from 'react-dom';

// get image URL
// get image address
var imageDatas = require('../data/imageDatas.json');

//self-executing anonymous function; convert fileName to imageURL
 imageDatas = ((imageDatasArr)=>{
  for(var i=0; i<imageDatasArr.length; i++){
    var singleImageData = imageDatasArr[i];
    singleImageData.imageURL = require('../images/'+singleImageData.fileName);
    imageDatasArr[i]= singleImageData;
  }
  return imageDatasArr;
})(imageDatas);


//获取区间内的一个随机值
function getRangeRandom(low,high){
  return Math.floor(Math.random()*(high-low)+low);
}
//获取0-30度之间的一个任意正负值
function get30DegRandom(){
  return (Math.random()>0.5?'':'-')+Math.floor(Math.random()*30);
}


// Image
class ImgFigure extends React.Component{
  constructor(props){
    super(props);
    this.handleClick=this.handleClick.bind(this);

  }

  handleClick(e){
    if(this.props.arrange.isCenter){
      this.props.inverse();
    }else{
      this.props.center();
    }
    e.stopPropagation();
    e.preventDefault();
  }
  render(){
    var styleObj={};
    //如果props属性中制定了这张图片的位置,则使用
    if(this.props.arrange.pos){
      styleObj=this.props.arrange.pos;
    }

    if(this.props.arrange.rotate){
      (['MozT','msT','OT','WebkitT','t']).forEach((value,index)=>{
        styleObj[value+'ransform']='rotate('+this.props.arrange.rotate+'deg)';
      });
    }
    if(this.props.arrange.isCenter){
      styleObj.zIndex = 11;
    }

    var imgFigureClassName ='img-figure';
    imgFigureClassName += this.props.arrange.isInverse? ' is-inverse':'';


    return(
      <figure className={imgFigureClassName} style={styleObj} onClick={this.handleClick}>
        <img src={this.props.data.imageURL} alt={this.props.data.title}/>
        <figcaption>
          <h2 className="img-title">{this.props.data.title}</h2>
          <div className="img-back" onClick={this.handleClick}>
            <p>
              {this.props.data.desc}
            </p>
          </div>
        </figcaption>
      </figure>
    );
  }
}

class ControllerUnit extends React.Component{
  constructor(props){
    super(props);
    this.handleClick=this.handleClick.bind(this);

  }
  handleClick(e){
    //如果点击的的是当前选中态的按钮,则翻转图片,否则将对应的图片居中
    if(this.props.arrange.isCenter){
      this.props.inverse();
    } else {
      this.props.center();
    }
    e.preventDefault();
    e.stopPropagation();
  }
  render(){
    var controllerUnitClassName='controller-unit';
    //如果对应的是居中的图片, 显示控制按钮的居中态
    if(this.props.arrange.isCenter) {
      controllerUnitClassName += ' is-center';

      //如果同时对应的是翻转图片, 显示控制按钮的翻转态
      if (this.props.arrange.isInverse) {
        controllerUnitClassName += ' is-inverse';
      }
    }
    return(<span className ={controllerUnitClassName} onClick={this.handleClick}></span>);

}

}

/// management
class AppComponent extends React.Component {

  constructor(props){
    super(props);

    this.Constant = {
      centerPos:{left:0, right:0},
      hPosRange:{leftSecX:[0,0],rightSecX:[0,0],y:[0,0]}, //水平方向的取值范围
      vPosRange:{x:[0,0],topY:[0,0]} //垂直方向的取值范围
    };

    this.state = {
      imgsArrangeArr:[
        /*{
        pos:{
        left:'0',
        top:'0',
        },
        rotate:0,
        isInverse:false,
        isCenter:false,//图片是否居中
        }*/
      ]
    };
  }
  /*
  * 翻转图片
  * @param index 输入当前被执行inverse操作的图片对应的图片信息数组的index值
  * @return {function}这是一个闭包函数, 其内return 一个真正待被执行的函数
  * */
  inverse(index){
    return () => {
      var imgsArrangeArr = this.state.imgsArrangeArr;
      imgsArrangeArr[index].isInverse = !imgsArrangeArr[index].isInverse;
      this.setState(
        {
          imgsArrangeArr:imgsArrangeArr
        });
    }
  }

  //重新布局所有图片 centerIndex 只等居中排布哪个图片
  rearrange(centerIndex) {
    var imgsArrangeArr = this.state.imgsArrangeArr,
      Constant = this.Constant,
      centerPos = Constant.centerPos,
      hPosRange = Constant.hPosRange,
      vPosRange = Constant.vPosRange,
      hPosRangeLeftSecX = hPosRange.leftSecX,
      hPosRangeRightSecX = hPosRange.rightSecX,
      hPosRangeY = hPosRange.y,
      vPosRangeTopY = vPosRange.topY,
      vPosRangeX = vPosRange.x,

    //存储位置在上侧部位的图片的状态信息, 从图片数组中取0个或者1个放在上册位置
      imgsArrangeTopArr = [],
      topImgNum = Math.floor(Math.random() * 2),

    //用来说明放在上边的图片属于数组中的哪一个
      topImgSpliceIndex = 0,
      imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex, 1);

    //首先居中 centerIndex的图片
    imgsArrangeCenterArr[0] = {
      pos: centerPos,
      rotate: 0,
      isCenter:true
    }
    // 居中的 centerIndex 不需要旋转

    //取出要布局上册的图片的状态信息
    topImgSpliceIndex = Math.floor(Math.random() * (imgsArrangeArr.length - topImgNum));
    imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex, topImgNum);

    //布局位于上册的图片
    imgsArrangeTopArr.forEach((value, index)=> {
      imgsArrangeTopArr[index] = {
        pos: {
          top: getRangeRandom(vPosRangeTopY[0], vPosRangeTopY[1]),
          left: getRangeRandom(vPosRangeX[0], vPosRangeX[1])
        },
        rotate: get30DegRandom(),
        isCenter:false
      };
    });
    //布局左右两侧的图片
    for (var i = 0, j = imgsArrangeArr.length, k = j / 2; i < j; i++) {
      var hPosRangeLORX = null;

      //前半部分布局左边,有半部分布局右边
      if (i < k) {
        hPosRangeLORX = hPosRangeLeftSecX;
      }
      else {
        hPosRangeLORX = hPosRangeRightSecX;
      }

      imgsArrangeArr[i] = {
        pos: {
          top: getRangeRandom(hPosRangeY[0], hPosRangeY[1]),
          left: getRangeRandom(hPosRangeLORX[0], hPosRangeLORX[1])
        },
        rotate: get30DegRandom(),
        isCenter:false
      };
    }

    if (imgsArrangeTopArr && imgsArrangeTopArr[0]) {
      imgsArrangeArr.splice(topImgSpliceIndex, 0, imgsArrangeTopArr[0]);
    }

    imgsArrangeArr.splice(centerIndex, 0, imgsArrangeCenterArr[0]);

    this.setState({
      imgsArrangeArr: imgsArrangeArr
    });
  }

    /*
     * 利用rearrange函数, 居中对应index的照片
     * @param index 需要悲剧中的照片的图片对应的图片信息数组的index值
     * @return {function}
     * */
  center(index) {
    return() => {
      this.rearrange(index);
    }
  }

  componentDidMount(){
    //拿到舞台的大小
    var stageDOM = ReactDOM.findDOMNode(this.refs.stage),
      stageW = stageDOM.scrollWidth,
      stageH = stageDOM.scrollHeight,
      halfStageW = Math.ceil(stageW/2),
      halfStageH = Math.ceil(stageH/2);

    //拿到一个imageFigure的大小
    var imgFigureDOM = ReactDOM.findDOMNode(this.refs.imgFigure0),
      imgW = imgFigureDOM.scrollWidth,
      imgH = imgFigureDOM.scrollHeight,
      halfImgW = Math.ceil(imgW/2),
      halfImgH = Math.ceil(imgH/2);
    //计算中心图片的位置点

    this.Constant.centerPos = {
      left: halfStageW-halfImgW,
      top:halfStageH-halfImgH
    };
// 计算左侧,右侧区域图片排布位置的取值范围
    this.Constant.hPosRange.leftSecX[0]= 0-halfImgW;
    this.Constant.hPosRange.leftSecX[1]= halfStageW - halfImgW*3;

    this.Constant.hPosRange.rightSecX[0]= halfStageW + halfImgW;
    this.Constant.hPosRange.rightSecX[1]= stageW - halfImgW;

    this.Constant.hPosRange.y[0]= 0 - halfImgW;
    this.Constant.hPosRange.y[1]= stageH - halfImgH/2;

    //计算上侧区域图片排布位置的取值范围
    this.Constant.vPosRange.topY[0]= 0-halfImgH;
    this.Constant.vPosRange.topY[1]= halfStageH - halfImgH*3;

    this.Constant.vPosRange.x[0]= halfStageW - imgW;
    this.Constant.vPosRange.x[1]= halfImgW;
    var num = Math.floor(Math.random()*10);
    this.rearrange(num)
    }

  render() {
    var controllerUnits = [],
      imgFigures = [];

    imageDatas.forEach((value, index)=>{
      if (!this.state.imgsArrangeArr[index]) {
        this.state.imgsArrangeArr[index] = {
          pos: {
            left: 0,
            top: 0
          },
          rotate: 0, //旋转角度
          isInverse: false, //图片正反面
          isCenter:false //是否居中
        }
      }
      imgFigures.push(<ImgFigure data={value}
                                 key={index}
                                 ref={'imgFigure'+index}
                                 arrange={this.state.imgsArrangeArr[index]}
                                 inverse={this.inverse(index)} center={this.center(index)}/>);
      controllerUnits.push(<ControllerUnit key={index}
                                           arrange={this.state.imgsArrangeArr[index]}
                                           inverse={this.inverse(index)} c
                                           center={this.center(index)}/>);
    });

    return (
      <section className="stage" ref="stage">
        <section className="img-sec">
          {imgFigures}
        </section>
        <nav className="controller-nav">
          {controllerUnits}
        </nav>
      </section>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
