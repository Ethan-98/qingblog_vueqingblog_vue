<template>
  <div>
    <Navigation>
      <!-- <Button @click="upLoadImg" type="primary" shape="circle">UpLoad</Button> -->
      <Button @click="modal1 = true;getAllLabel()" type="primary" shape="circle">UpLoad</Button>
    </Navigation>
    <div style="position:relative;z-index:0">
      <div class="mavonEditor">
        <div style="padding:5px;">
          <Input prefix="md-book" v-model="title" placeholder="输入文章标题"/>
        </div>
        <mavon-editor ref=md v-model="markdown" :ishljs="true" @imgAdd="$imgAdd" @imgDel="$imgDel">
      </mavon-editor>
    </div>
    </div>
        <!-- <Button type="primary" @click="modal1 = true">Display dialog box</Button> -->
    <Modal
        v-model="modal1"
        title="发布文章"
        @on-ok="upLoadImg()"
        @on-cancel="cancel"
        style="position:relative;z-index:10">
        <p><strong>文章标题：</strong></p>
        <p style="margin-left:20px">{{this.title}}</p>
        <p><strong>选择文章标签</strong></p>
        <Button shape="circle" icon="ios-add" size="small" @click="modal2=true">添加自定义标签</Button>
        <Modal v-model="modal2"
            @on-ok="insertLabel()">
            <Row>
              <Col span="20">
                <Input v-model="selfLabelTitle" placeholder="输入自定义标签标题"/>
                <br/>
                <Input v-model="selfLabelDescription" placeholder="输入自定义标签描述"/>
              </Col>
            </Row>
        </Modal>
        <Row>
          <Col span="24">
              <Card style="height:100px;overflow-y:scroll;position: relative;">
                <!-- 显示所有标签 -->
                <div style="display:inline;margin:2px;" v-for="(item,index) in labels" :key="index">
                  <!-- <Button :type="this.labels[index].selected" shape="circle" icon="ios-add" size="small" @click="changeLabelState(index)">{{item.labelTitle}}</Button> -->
                  <Tag checkable :checked=false color="primary" @on-change="addOrDelLabel(item.labelId)">{{item.labelTitle}}</Tag>
                </div>
              </Card>
          </Col>
        </Row>
        <p><strong>文章类型</strong></p>
        <!-- <Dropdown style="margin-left: 20px" @on-click="selectCategory">
            <Button type="primary">
                文章类型
                <Icon type="ios-arrow-down"></Icon>
            </Button>
            <DropdownMenu slot="list">
                <DropdownItem name="category0">原创</DropdownItem>
                <DropdownItem name="category1">转载</DropdownItem>
                <DropdownItem name="category2">翻译</DropdownItem>
            </DropdownMenu>
        </Dropdown> -->
        <Select v-model="blogCategory" style="width:200px">
            <Option v-for="item in categoryList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
    </Modal>
  </div>
</template>

<script>
import Navigation from "@/components/Navigation.vue";
// import func from '../../../vue-temp/vue-editor-bridge';
// import func from '../../../vue-temp/vue-editor-bridge';
export default {
  data() {
    return {
      title:"",
      markdown: "",
      modal1:false,
      modal2:false,
      img_file: {},
      img_count: 0,
      labels: {},
      label:'default',
      selectedLabel:[],
      selfLabelTitle:'',
      selfLabelDescription:'',
      blogCategory:0,
      categoryList:[
        {
          value:0,
          label:'原创'
        },
        {
          value:1,
          label:'转载'
        },
        {
          value:2,
          label:'翻译'
        }
      ]
    };
  },
  components: {
    Navigation
  },
  // mounted:{
    
  // },
  methods: {
    // updateDoc(markdown, html) {
    //   // 此时会自动将 markdown 和 html 传递到这个方法中
    //   console.log("markdown内容: " + markdown);
    //   console.log("html内容:" + html);
    // },
    $imgAdd(pos, $file) {
      // console.log(pos);
      // 缓存图片信息
      this.img_file[pos] = $file;
      this.img_count++;
      // console.log(this.img_file);
      // console.log("----------------");
    },
    $imgDel(pos) {
      // console.log("----------------");
      // console.log("pos: "+pos);
      // console.log(this.img_file)
      delete this.img_file[pos+''];
      this.img_count--;
      // console.log("pos: "+pos);
      // console.log(this.img_file)
      // console.log("----------------");
    },
    // uploadimg($e){
    upLoadImg() {
      // 第一步.将图片上传到服务器.
      if(this.img_count>0){
        // console.log(this.img_file);
        var formdata = new FormData();
        var positons = [];
        for (var _img in this.img_file) {
          formdata.append("files", this.img_file[_img]);
          positons.push(_img);
          // console.log(this.img_file[_img]);
        }
        formdata.append("positons", positons);
        // console.log(formdata);
        let that=this;
        this.$axios({
          url: "upLoadImgArray",
          method: "post",
          processData: false,
          data: formdata,
          headers: { "Content-Type": "multipart/form-data" }
        }).then(res => {
          // console.log(res);
          if(res.data.status==200){
            for (var i in res.data.data) {
              // console.log(res.data.data)
              // console.log(i)
              that.$refs.md.$img2Url(res.data.data[i]['position'], res.data.data[i]['url']);
            }
            that.upLoad()
          }
          else{
              that.$Message.error(res.data.msg)
          }
        }).catch((error)=>{
          that.$Message.error(error.data.msg)
        });
      }
      else{
        this.upLoad()
      }
    },
    cancel(){

    },
    upLoad(){
      // console.log("markdown")
      // console.log(this.markdown)
      // console.log("encodeURIt"+encodeURI(this.markdown));
      // console.log("encodeURI"+btoa(encodeURI(this.markdown)));
      let content = btoa(encodeURI(this.markdown));
      let that=this;
      this.$axios.post('/upLoadMarkdown',{
        'blogTitle' : that.title,
        'blogContent' : content,
        'blogCategory':that.blogCategory
      }).then(res=>{
        // console.log(res);
        if(res.data.status==200){
          console.log(that.selectedLabel)
          that.$axios.post('/addLabel',{
            'blogId':res.data.data,
            'selectedLabel':that.selectedLabel
          }).then(function(res){
            console.log(res)
          }).catch((error)=>{
            that.$Message.error(error.data.msg)
          });
          that.$Message.success('上传成功！');
          that.$router.push('/');
        }
        else{
            that.$Message.error(res.data.msg)
        }
      }).catch((error)=>{
        that.$Message.error(error.data.msg)
      });
    },
    getAllLabel(){
      let that=this;
      this.$axios.post('/getAllLabel').then(function(res){
        if(res.data.status==200){
          // console.log(res)
          that.labels=res.data.data;
          // console.log(res.data.data)
          // console.log(that.labels)
          // for(var i = 0; i < that.labels.length; i++) {
          //   // console.log(that.labels[i])
          //   that.labels[i].selected='default';
          // }
          that.labels = res.data.data
        }
        else{
          that.$Message.error(res.data.msg)
        }
      }).catch((error)=>{
        that.$Message.error(error.data.msg)
      });
    },
    // changeLabelState(index){
      // console.log(this.labels[index].selected)
      // if(this.labels[index].selected=='default'){
      //   this.labels[index].selected='primary';
      // }
      // else{
      //   this.labels[index].selected='default';
      // }
      // console.log(this.labels[index])
      // if(this.labels[index].selected=='default'){
        
      //   this.labels[index].selected='primary';
      // }else{
      //   this.labels[index].selected='default';
      // }
      // console.log(this.labels[index].selected)
    // },
    addOrDelLabel(index){
      // console.log("index: "+index)
      // console.log(this.selectedLabel)
      if(this.selectedLabel.indexOf(index)==-1){
        this.selectedLabel.push(index)
        // console.log(this.selectedLabel)
      }
      else{
        this.selectedLabel.splice(this.selectedLabel.indexOf(index), 1)
        // console.log(this.selectedLabel)
      }
    },
    insertLabel(){
      let that=this
      this.$axios.post('/insertLabel',{
        'labelTitle':that.selfLabelTitle,
        'labelDescription':that.selfLabelDescription
      }).then(function(res){
        if(res.data.status==200){
          console.log(res)
          that.getAllLabel()
        }
        else{
          that.$Message.error(res.data.msg)
        }
      }).catch((error)=>{
        that.$Message.error(error.data.msg)
      });
    },
    selectCategory(){

    },

    handle(item){
      console.log(item)
    }
  }
};
</script>

<style scoped>
.mavonEditor {
  width: 100%;
  height: 700px;
}
</style>