<template>
    <div class="div">
        <header>
            <Navigation></Navigation>
        </header>
        <Row style="width:100%">
            <Col span="5"><br></Col>
            <Col span="14">
                <div style="width:100%">
                    <Row>
                        <div style="text-align:left">
                            <h1>
                            {{this.blog.blogTitle}}
                            </h1>
                        </div>
                    </Row>
                    <Row>
                        <Col span="8" style="text-align:left;padding-left:5px">
                            <Icon type="ios-contact-outline" /> {{this.authName}}
                        </Col>
                        <Col span="8" style="text-align:left">
                            最后发布于 <Icon type="md-clipboard" />{{this.blog.releaseDate.toString().substr(0,10)}}
                        </Col>
                        <Col span="8" style="text-align:left">
                            阅读数 <Icon type="ios-eye" /> {{this.blog.views}}
                        </Col>
                    </Row>
                </div>
                <div style="width:100%;margin-top:10px">
                    <mavon-editor :toolbars="markdownOption" v-model="this.doc" :subfield="false" :toolbarsFlag="false" defaultOpen="preview"/>
                </div>
                <Row style="text-align:left">
                    <Button @click="thumbsFunction()" style="margin-left:30px"><Icon id="thumbs" :type="this.thumbs"/>{{this.thumbsText}}</Button>
                    <Button @click="starFunction()" style="margin-left:30px;margin-right:30px"><Icon id="star" :type="this.star" />{{this.starText}}</Button>
                    <Poptip word-wrap width="200" content="URL已复制到剪贴板" placement="top-start">
                        <Button @click="share()" id="copyUrl" data-clipboard-action="copy"><Icon type="md-share-alt" />分享</Button>
                    </Poptip>
                </Row>
            </Col>
            <Col span="5"><br></Col>
        </Row>
    </div>
</template>

<script>
import Navigation from '@/components/Navigation.vue'
export default {
    data(){
        return{
            blogId:this.$route.query.blogId,
            blog:{},
            authName:'',
            doc:'',
            thumbs:'ios-thumbs-up-outline',
            thumbsText:'点赞',
            star: 'md-star-outline',
            starText :'收藏',
            markdownOption: {

            }
        }
    },
    components:{
        Navigation,
    },
    mounted(){
        this.auth();
        // this.getBlog()
    },
    methods:{
        auth(){
            let that=this;
            // console.log(this.blogId)
            this.$axios.post('/viewBlog',{
                blogId:that.blogId
            }).then(function(res){
                console.log(res.data)
                that.blog=res.data.data;
                that.doc=decodeURI(atob(atob(that.blog.blogContent)));
                that.$axios.post('/selectInfo',{
                    userId:that.blog.userId
                    }).then(function(res){
                        // console.log(res.data)
                        // console.log(that)
                        that.authName=res.data.userName
                })
            })
        },
        thumbsFunction(){
            // this.thumbs=this.thumbs=='ios-thumbs-up-outline'?'md-thumbs-up':'ios-thumbs-up-outline';
            if(this.thumbs=='ios-thumbs-up-outline'){
                this.thumbs='md-thumbs-up';
                this.thumbsText='已点赞'
            }
            else{
                this.thumbs='ios-thumbs-up-outline';
                this.thumbsText='点赞'
            }
        },
        starFunction(){
            if(this.star=='md-star-outline'){
                this.star='md-star';
                this.starText='已收藏';
            }
            else{
                this.star='md-star-outline';
                this.starText='收藏';
            }
        },
        share(){
            var _val=window.location.href;
            new this.ClipboardJS('#copyUrl', {
                text: function() {
                    return _val;
                }
            });
        }
    }
}
</script>

<style scoped>

</style>