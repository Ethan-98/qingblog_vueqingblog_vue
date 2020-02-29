<template>
  <div>
    <Navigation>
      <Button @click="upLoadImg()" type="primary" shape="circle">UpLoad</Button>
    </Navigation>
    <div class="mavonEditor">
      <div style="padding:5px;">
        <Input prefix="md-book" v-model="title" placeholder="输入文章标题"/>
      </div>
      <mavon-editor ref=md v-model="markdown" :ishljs="true" @imgAdd="$imgAdd" @imgDel="$imgDel">
    </mavon-editor>
    </div>
  </div>
</template>

<script>
import Navigation from "@/components/Navigation.vue";
export default {
  data() {
    return {
      title:"",
      markdown: "",
      img_file: {},
      img_count: 0
    };
  },
  components: {
    Navigation
  },
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
          for (var i in res.data.data) {
            // console.log(res.data.data)
            // console.log(i)
            that.$refs.md.$img2Url(res.data.data[i]['position'], res.data.data[i]['url']);
          }
          that.upLoad()
        });
      }
      else{
        this.upLoad()
      }
    },
    upLoad(){
      // console.log("markdown")
      // console.log(this.markdown)
      // console.log("encodeURIt"+encodeURI(this.markdown));
      // console.log("encodeURI"+btoa(encodeURI(this.markdown)));
      let content = btoa(encodeURI(this.markdown));
      let that=this;
      this.$axios.post('upLoadMarkdown',{
        'blogTitle' : that.title,
        'blogContent' : content
      }).then(res=>{
        // console.log(res);
        if(res.data.status==200){
          that.$Message.success('上传成功！');
          that.$router.push('/');
        }
      })
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