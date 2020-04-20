<template>
    <div>
        <Row>
            <Col span="24" style="background:#FBFBFB;">
                <Card dis-hover :bordered="false" style="background:#FBFBFB;padding:0px;margin:0px">
                    <Row style="width:100%;padding:0px">
                        <Col span="2">
                            <div>
                                <img :src="imgUrl" style="height:30px;width:30px;border-radius:15px;border-color:#000">
                            </div>
                        </Col>
                        <Col span="20">
                            <Row>
                                <div style="float:left;padding-left:10px">{{userName}}</div>
                            </Row>
                            <Row>
                                <div style="float:left;padding-left:10px;">{{commentContent}}</div>
                            </Row>
                            <Row style="padding-bottom:0px">
                                <Col span="12">
                                    <div style="float:left"><Icon type="md-calendar" />{{commentDate}}</div>
                                </Col>
                                <Col span="9">
                                    <div style="float:right;" @click="modal1=true"><Icon type="ios-chatboxes-outline"/>回复</div>
                                    <Modal v-model="modal1" @on-ok="addChildComment()">
                                        <Input v-model="newCommentContent" style="width: 100%;"></Input>
                                    </Modal>
                                </Col>
                                <Col span="3">
                                    <div style="float:right" @click="thumbsClick()"><Icon :type="this.thumbs"/>{{this.thumbsText}}</div>
                                </Col>
                            </Row>
                            <!-- 二级回复 -->
                            <Divider style="margin-top:10px;margin-bottom:10px"/>
                            <AChildComment v-for="(item,index) in commentList" :key="index" :comment="item" :parentCommentId="commentId"></AChildComment>
                            <!-- <Row style="padding-top:0px">
                                <Row style="width:100%">
                                    <Col span="2">
                                        <div>
                                            <img :src="imgUrl" style="height:30px;width:30px;border-radius:15px;border-color:#000">
                                        </div>
                                    </Col>
                                    <Col span="22">
                                        <Row>
                                            <div style="float:left;padding-left:10px">{{userName}}</div>
                                        </Row>
                                        <Row>
                                            <div style="float:left;padding-left:10px">{{commentContent}}</div>
                                        </Row>
                                        <Row>
                                            <Col span="12">
                                                <div style="float:left"><Icon type="md-calendar" />{{commentDate}}</div>
                                            </Col>
                                            <Col span="10">
                                                <div style="float:right;"><Icon type="ios-chatboxes-outline" />回复</div>
                                            </Col>
                                            <Col span="2">
                                                <div style="float:right"><Icon type="ios-thumbs-up-outline" />赞</div>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                            </Row> -->
                            <!-- 二级回复 -->
                        </Col>
                    </Row>
                </Card>
            </Col>
        </Row>
    </div>
</template>

<script>
import AChildComment from '@/components/AChildComment.vue'
export default {
    props:{
        comment:{
            type: Object,
            default: () => {}
        }
    },
    components:{
        AChildComment,
    },
    data(){
        return{
            commentId:'',
            blogId:'',
            userName:'',
            commentContent:'',
            commentDate:'',
            imgUrl:'',
            commentList:[],
            pageNo:1,
            pageSize:5,
            modal1:false,
            thumbs:'',
            thumbsText:'',
            newCommentContent:''
        }
    },
    mounted(){
        this.init();
        this.getChildCommentList();
        //点赞状态
        this.thumbsFunction();
        // TODO:查看点赞状态，在页面刷新的时候
    },
    methods:{
        init(){
            // console.log(this.comment);
            this.commentId=this.comment.comment_id;
            this.blogId=this.comment.blog_id;
            this.userName=this.comment.user_name;
            this.commentContent=this.comment.comment_content;
            this.commentDate=this.comment.comment_date.toString().substr(0,10);
            if(this.comment.user_image!=''&&this.comment.user_image!=null){
                this.imgUrl='http://localhost:8080/qingblog/img?id='+this.comment.user_image;
            }
            else{
                this.imgUrl='http://localhost:8080/qingblog/img?id=5e80428c61e91666ed9d5718';
            }
        },
        getChildCommentList(){
            let that=this;
            this.$axios.get('/comment/commentId/'+that.commentId,{
                params:{
                    'pageNo':that.pageNo,
                    'pageSize':that.pageSize,
                }
            }).then(function(res){
                if(res.data.status==200){
                    // console.log(res.data)
                    that.commentList=res.data.data
                }
                else{
                    that.$Message.error(res.data.msg)
                }
            }).catch((error)=>{
                that.$Message.error(error.data.msg)
            });
        },
        // 添加二级评论
        addChildComment(){
            let that=this;
            this.$axios.post('/comment/insert',{
                'blogId':that.blogId,
                'commentContent':that.newCommentContent,
                'parentCommentId':that.commentId,
                'replyCommentId':that.commentId
            }).then(function(res){
                if(res.data.status==200){
                    that.$Message.success("回复评论成功！")
                }
                else{
                    that.$Message.error(res.data.msg)
                }
            }).catch((error)=>{
                that.$Message.error(error.data.msg)
            });
        },
        thumbsFunction(){
            let that=this;
            this.$axios.post('/commentPraise/select',{
                'commentId':that.commentId
            }).then(function(res){
                // console.log(res)
                if(res.data.status==200){
                    if(res.data.data!=0){
                        that.thumbs='md-thumbs-up';
                        that.thumbsText='已点赞'
                    }
                    else{
                        that.thumbs='ios-thumbs-up-outline';
                        that.thumbsText='点赞'
                    }
                }
                else{
                    that.$Message.error(res.data.msg)
                }
            }).catch((error)=>{
                that.$Message.error(error.data.msg)
            });
            // if(this.thumbs=='ios-thumbs-up-outline'){
            //     this.thumbs='md-thumbs-up';
            //     this.thumbsText='已点赞'
            // }
            // else{
            //     this.thumbs='ios-thumbs-up-outline';
            //     this.thumbsText='点赞'
            // }
        },
        thumbsClick(){
            //未点赞
            let that=this;
            if(this.thumbsText=="点赞"){
                this.$axios.post('/commentPraise/insert',{
                    'commentId':this.commentId
                }).then(function(res){
                    // console.log(res)
                    if(res.data.status==200){
                        that.thumbs='md-thumbs-up';
                        that.thumbsText='已点赞'
                    }
                    else{
                        that.$Message.error(res.data.msg)
                    }
                }).catch((error)=>{
                    that.$Message.error(error.data.msg)
                });
            }
            //已点赞
            else{
                this.$axios.post('/commentPraise/delete',{
                    'commentId':this.commentId
                }).then(function(res){
                    // console.log(res)
                    if(res.data.status==200){
                        that.thumbs='ios-thumbs-up-outline';
                        that.thumbsText='点赞'
                    }
                    else{
                        that.$Message.error(res.data.msg)
                    }
                }).catch((error)=>{
                    that.$Message.error(error.data.msg)
                });
            }
        },
    }
}
</script>

<style scoped>

</style>