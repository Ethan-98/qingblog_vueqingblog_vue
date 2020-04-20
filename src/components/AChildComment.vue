<template>
    <div>
        <Row style="padding-top:0px;padding-bottom:3px">
            <Row style="width:100%">
                <Col span="2">
                    <div>
                        <img :src="imgUrl" style="height:30px;width:30px;border-radius:15px;border-color:#000">
                    </div>
                </Col>
                <Col span="22">
                    <Row>
                        <div style="float:left;padding-left:10px">{{userName+" 回复了 "+replyUsername}}</div>
                    </Row>
                    <Row>
                        <div style="float:left;padding-left:10px">{{commentContent}}</div>
                    </Row>
                    <Row>
                        <Col span="12">
                            <div style="float:left"><Icon type="md-calendar" />{{commentDate}}</div>
                        </Col>
                        <Col span="9">
                            <!-- <div style="float:right;" @click="modal1=true"><Icon type="ios-chatboxes-outline"/>??</div> -->
                            <div style="float:right" @click="modal1=true"><Icon type="ios-chatboxes-outline" />回复</div>
                            <Modal v-model="modal1" @on-ok="addChildComment()">
                                <Input v-model="newCommentContent" style="width: 100%;"></Input>
                            </Modal>
                        </Col>
                        <Col span="3">
                            <div style="float:right" @click="thumbsClick()"><Icon :type="thumbs"/>{{this.thumbsText}}</div>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Row>
    </div>
</template>

<script>
export default {
    props:{
        comment:{
            type: Object,
            default: () => {}
        },
        parentCommentId:{
            type: String,
            default: () => {}
        }
    },
    data(){
        return{
            commentId:'',
            blogId:'',
            userName:'',
            commentContent:'',
            commentDate:'',
            imgUrl:'',
            modal1:false,
            thumbs:'',
            thumbsText:'',
            newCommentContent:'',
            replyCommentId:'',
            replyUsername:''
        }
    },
    mounted(){
        this.init();
        this.thumbsFunction();
        this.getReplyUsername();
    },
    methods:{
        init(){
            // console.log("child")
            // console.log(this.comment);
            this.commentId=this.comment.comment_id;
            this.blogId=this.comment.blog_id;
            this.userName=this.comment.user_name;
            this.commentContent=this.comment.comment_content;
            this.replyCommentId=this.comment.reply_comment_id,
            this.commentDate=this.comment.comment_date.toString().substr(0,10);
            if(this.comment.user_image!=''&&this.comment.user_image!=null){
                this.imgUrl='http://localhost:8080/qingblog/img?id='+this.comment.user_image;
            }
            else{
                this.imgUrl='http://localhost:8080/qingblog/img?id=5e80428c61e91666ed9d5718';
            }
        },
        // ??????
        addChildComment(){
            let that=this;
            this.$axios.post('/comment/insert',{
                'blogId':that.blogId,
                'commentContent':that.newCommentContent,
                'parentCommentId':that.parentCommentId,
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
            //     this.thumbsText='???'
            // }
            // else{
            //     this.thumbs='ios-thumbs-up-outline';
            //     this.thumbsText='??'
            // }
        },
        thumbsClick(){
            //???
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
            //???
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
        getReplyUsername(){
            let that=this;
            this.$axios.get('/comment/selectComment/'+that.replyCommentId).then(function(res){
                if(res.data.status==200){
                    that.replyUsername=res.data.data.user_name
                    // console.log(res.data.data.user_name)
                    // console.log(that.replyUsername)
                }
                else{
                        that.$Message.error(res.data.msg)
                    }
                }).catch((error)=>{
                    that.$Message.error(error.data.msg)
            });
        }
    }
}
</script>

<style scoped>

</style>