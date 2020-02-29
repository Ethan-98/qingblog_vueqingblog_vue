<template>
    <div @click="viewContent()">
        <Row>
            <Col span="24">
                <div style="width:100%;height:220px;background:#eee;padding: 10px;">
                    <Card style="width:100%;height:100%;background:#eee;">
                        <Row style="height:100%">
                            <Col span="6" style="height:160px;width:160px">
                                <div style="text-align:left;">
                                    <img :src="imgUrl" style="height:160px;width:160px">
                                </div>
                            </Col>
                            <Col span="18" style="height:160px">
                                <Row style="height:40px;padding-top:15px;padding-left:25px;font-size:20px">
                                    <div style="text-align:left">
                                        {{blogTitle}}
                                    </div>
                                </Row>
                                <Row style="height:40px;padding-top:15px;padding-left:25px;">
                                    <Col span="6">
                                        <Icon type="ios-person" />
                                        {{auth.userName}}
                                    </Col>
                                    <Col span="6">
                                        <Icon type="ios-eye" />
                                        {{views}}
                                    </Col>
                                    <Col span="12">
                                        <a href="#RHSY">#</a>
                                        SpringMVC,Spring
                                    </Col>
                                </Row>
                                <Row style="padding-top:15px;padding-left:25px;">
                                    <textarea disabled style="width:100%;border:none;resize: none;cursor: pointer;" rows="4" v-model="blogContent"></textarea>
                                </Row>
                            </Col>
                        </Row>
                    </Card>
                </div>
            </Col>
        </Row>
    </div>
</template>

<script>
export default {
    props:{
        blog:{
            type: Object,
            default: () => {}
        }
    },
    data(){
        return{
            blogId:this.blog.blogId,
            userId:this.blog.userId,
            releaseDate:this.blog.releaseDate,
            blogTitle:this.blog.blogTitle,
            blogContent:decodeURI(atob(atob(this.blog.blogContent))),
            views:this.blog.views,
            auth:{},
            imgUrl:''
        }
    },
    mounted () {
        this.init();
    },
    methods:{
        init(){
            console.log("ABLOGABLOGABLOG")
            console.log(this.blog)
            let that=this;
            this.$axios.post('/selectInfoByUserId',{
                'userId':this.blog.userId,
            }).then(function (res) {
                // console.log(res)
                that.auth=res.data;
                // console.log(that.auth.userImage)
                if(that.auth.userImage==null){
                    that.imgUrl='http://localhost:8080/qingblog/img?id=5e59167dbfd99045539dd9f0';
                }
                else{
                    that.imgUrl='http://localhost:8080/qingblog/img?id='+that.auth.userImage;
                }
            })
        },
        viewContent(){
            let that=this;
            this.$router.push({
                path: 'blog',
                // name: 'blog',
                query:{
                    // blog:that.blog
                    blogId: that.blogId
                }
            })
        }
    }
}
</script>

<style scoped>

</style>