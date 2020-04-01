<template>
    <div class="div">
        <header>
            <Navigation></Navigation>
        </header>
        <Row style="width:100%">
            <Col span="5"><br></Col>
            <Col span="14">
                <div style="width:100%;background:#FBFBFB;padding-left:30px;padding-bottom:5px">
                    <Row>
                        <div style="text-align:left">
                            <h1>
                            {{this.blog.blogTitle}}
                            </h1>
                        </div>
                    </Row>
                    <Row>
                        <Col span="6" style="text-align:left;padding-left:5px">
                            <Icon type="ios-contact-outline" /> {{this.authName}}
                        </Col>
                        <Col span="6" style="text-align:left">
                            最后发布于 <Icon type="md-clipboard" />{{this.blog.releaseDate.toString().substr(0,10)}}
                        </Col>
                        <Col span="6" style="text-align:left">
                            阅读数 <Icon type="ios-eye" /> {{this.blog.views}}
                        </Col>
                        <Col span="6" style="text-align:left">
                            话题 <Icon type="md-attach" /> 
                            <div style="display:inline" v-if="labels[0]">#{{labels[0].labelTitle+", "}}</div>
                            <div style="display:inline" v-if="labels[1]">#{{labels[1].labelTitle}}</div>
                        </Col>
                    </Row>
                </div>
                <div style="width:100%;margin-top:10px;z-index:-1;position:relative;">
                    <mavon-editor :toolbars="markdownOption" v-model="doc" :subfield="false" :toolbarsFlag="false" defaultOpen="preview" :boxShadow="false"/>
                </div>
                <Row style="text-align:left;background:#FBFBFB;padding-top:15px;padding-bottom:15px">
                    <!-- 点赞按钮 -->
                    <Button @click="thumbsClick()" style="margin-left:30px"><Icon id="thumbs" :type="this.thumbs"/>{{this.thumbsText}}</Button>
                    <!-- <Button @click="starFunction()" style="margin-left:30px;margin-right:30px"><Icon id="star" :type="this.star" />{{this.starText}}</Button> -->
                    <!-- 收藏按钮 -->
                    <Button style="margin-left:30px;margin-right:30px" @click="getFavoritesList()"><Icon id="star" :type="this.star" />{{this.starText}}</Button>
                    <Modal
                        v-model="modal1" width="400" style="position:relative;z-index:5;" :styles="{top: '200px'}">
                        <p slot="header" style="color:#f60;text-align:center">
                            <Icon type="ios-star" />
                            <span>我的收藏夹</span>
                        </p>
                        <div style="text-align:left">
                            <RadioGroup v-model="favoritesSelect" style="width:100%" vertical>
                                <!-- <Radio v-for="(item,index) in favoriteList" :key="index" :label="item.favoritesName"></Radio> -->
                                <div v-for="(item,index) in favoriteList" :key="index">
                                    <Row>
                                    <div style="float:left">
                                        <Radio :label="item.favoritesId">{{item.favoritesName}}</Radio>
                                    </div>
                                    <div style="float:right">
                                        <Icon @click="modal3=true" type="md-close" />
                                        <Modal :mask="false" style="position:relative;z-index:10" :styles="{top: '250px'}" v-model="modal3" width="380px" @on-ok="delFavoritesList(item.favoritesId)">
                                            <p>确定删除此文件夹吗？（内含收藏文件会相应删除）</p>
                                        </Modal>
                                    </div>
                                    </Row>
                                </div>
                            </RadioGroup>
                        </div>
                        <div slot="footer">
                            <Button @click="modal2 = true" type="info" style="float:left"><Icon type="md-add" />添加收藏夹</Button>
                            <Button>取消</Button>
                            <Button type="success" @click="addStar">确定</Button>
                        </div>
                    </Modal>
                    <Modal style="position:relative;z-index:10" :styles="{top: '250px'}" v-model="modal2" width="360px" @on-ok="newFavoritesListOk" @on-cancel="newFavoritesListCancel">
                        <Input v-model="newFavoritesName" placeholder="输入收藏文件夹名称（不可重名）" style="width: 300px" />
                    </Modal>
                    <Poptip word-wrap width="200" content="URL已复制到剪贴板" placement="right-start">
                        <Button @click="share()" id="copyUrl" data-clipboard-action="copy"><Icon type="md-share-alt" />分享</Button>
                    </Poptip>
                    <Row>
                        <Col span="2">
                            <div style="margin-left:30px;margin-top:12px">
                                <img :src="imgUrl" style="height:50px;width:50px;border-radius:25px;border-color:#000">
                            </div>
                        </Col>
                        <Col span="22">
                            <div style="margin-left:30px;margin-top:12px;margin-bottom:5px">{{authName}}</div>
                            <div style="margin-left:30px">发布了{{authBlogCount}}篇文章、获赞数 {{1}}、访问量 {{1}}</div>
                        </Col>
                    </Row>
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
            authBlogCount:'',
            imgUrl:'',
            markdownOption: {},
            modal1: false,
            modal2: false,
            modal3: false,
            favoriteList:[],
            value:'',
            newFavoritesName:'',
            favoritesSelect:'',
            labels:[]
        }
    },
    components:{
        Navigation,
    },
    mounted(){
        this.auth();
        // this.getBlog()
        this.updateViews();
        this.starFunction();
        this.thumbsFunction();
        this.getLabels();
    },
    methods:{
        auth(){
            let that=this;
            // console.log(this.blogId)
            this.$axios.post('/viewBlog',{
                blogId:that.blogId
            }).then(function(res){
                if(res.data.status==200){
                    // console.log(res.data)
                    that.blog=res.data.data;
                    // console.log(that.blog)
                    that.doc=decodeURI(atob(atob(that.blog.blogContent)));
                    that.$axios.post('/selectInfoByUserId',{
                        userId:that.blog.userId
                        }).then(function(res){
                            if(res.data.status==200){
                                // console.log(res.data)
                                // console.log(that)
                                that.authName=res.data.userName,
                                that.imgUrl='http://localhost:8080/qingblog/img?id='+res.data.userImage;
                                }
                                else{
                                    that.$Message.error(res.data.msg)
                                }
                        }).catch((error)=>{
                            that.$Message.error(error.data.msg)
                        });

                    that.$axios.post('/getAuthBlogCount',{
                        userId:that.blog.userId
                    }).then(function(res){
                        if(res.data.status==200){
                            // console.log(res)
                            that.authBlogCount=res.data.data;
                        }
                        else{
                            that.$Message.error(res.data.msg)
                        }
                    }).catch((error)=>{
                        that.$Message.error(error.data.msg)
                    });
                }
                else{
                    that.$Message.error(res.data.msg)
                }
            })
        },
        updateViews(){
            let that=this;
            this.$axios.post('/updateViews',{
                blogId:this.blogId
            }).then(function(res){
                if(res){
                    console.log(res)
                }
                else{
                    that.$Message.error(res.data.msg)
                }
            }).catch((error)=>{
                that.$Message.error(error.data.msg)
            });
        },
        //检查点赞状态
        thumbsFunction(){
            let that=this;
            this.$axios.post('/selectBlogPraise',{
                'blogId':that.blogId
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
        // 检查收藏状态
        starFunction(){
            // console.log("STAR")
            let that=this;
            // console.log(this.blogId)
            this.$axios.post('/selectStarStatus',{
                'blogId':that.blogId
            }).then(function(res){
                if(res.data.status==200){
                    // console.log(res.data.data)
                    if(res.data.data!=0){
                        that.star='md-star';
                        that.starText='已收藏';
                    }
                    else{
                        that.star='md-star-outline';
                        that.starText='收藏';
                    }
                }
                else{
                    that.$Message.error(res.data.msg)
                }
            }).catch((error)=>{
                that.$Message.error(error.data.msg)
            });
            // if(this.star=='md-star-outline'){
            //     this.star='md-star';
            //     this.starText='已收藏';
            // }
            // else{
            //     this.star='md-star-outline';
            //     this.starText='收藏';
            // }
        },
        share(){
            var _val=window.location.href;
            new this.ClipboardJS('#copyUrl', {
                text: function() {
                    return _val;
                }
            });
        },
        getFavoritesList(){
            // 未收藏状态
            if(this.starText=="收藏"){
                this.modal1 = true;
                let that=this;
                this.$axios.post('/getFavoritesList').then(function(res){
                    if(res.data.status==200){
                        // console.log("GETFAVORITESLIST")
                        // console.log(res);
                        that.favoriteList=res.data.data;
                    }
                    else{
                        that.$Message.error(res.data.msg)
                    }
                }).catch((error)=>{
                    that.$Message.error(error.data.msg)
                });
            }
            else{//已收藏状态，则取消此收藏
                let that=this;
                this.$axios.post('/delFavorites',{
                    'blogId':that.blogId
                }).then(function(res){
                    // console.log(res)
                    if(res.data.status==200){
                        that.star='md-star-outline';
                        that.starText='收藏';
                        that.$Message.success("已取消收藏！");
                    }
                    else{
                        that.$Message.error(res.data.msg)
                    }
                }).catch((error)=>{
                    that.$Message.error(error.data.msg)
                });
            }
        },
        //点击点赞按钮，若已点赞，则取消，未点赞，则点赞
        thumbsClick(){
            //未点赞
            let that=this;
            if(this.thumbsText=="点赞"){
                this.$axios.post('/addBlogPraise',{
                    'blogId':that.blogId
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
                this.$axios.post('/delBlogPraise',{
                    'blogId':that.blogId
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
        newFavoritesListOk(){
            if(this.newFavoritesName!=''){
                let that=this;
                this.$axios.post('/addFavoritesList',{
                    favoritesName:that.newFavoritesName
                }).then(function(res){
                    // console.log(res);
                    if(res.data.status==200){
                        that.getFavoritesList();
                    }
                    else{
                        that.$Message.error(res.data.msg)
                    }
                }).catch((error)=>{
                    // console.log(error)
                    that.$Message.error(error.data.msg)
                })
            }
            else{
                this.$Message.error('文件夹名不能为空！');
            }
        },
        delFavoritesList(favoriteId){
            // console.log(favoriteId)
            let that=this;
            this.$axios.post('/delFavoritesList',{
                favoritesId:favoriteId
            }).then(function(res){
                if(res.data.status==200){
                    // console.log(res)
                    that.getFavoritesList();
                }
                else{
                    that.$Message.error(res.data.msg)
                }
            }).catch((error)=>{
                that.$Message.error(error.data.msg)
            });
        },
        newFavoritesListCancel(){

        },
        addStar(){
            // console.log("-----------------------")
            // console.log(this.favoritesSelect);
            let that=this;
            if(that.favoritesSelect!=''){
                this.$axios.post('/addFavorites',{
                    'favoritesId':that.favoritesSelect,
                    'blogId':that.blogId,
                    'blogTitle':that.blog.blogTitle
                }).then(function(res){
                    // console.log(res)
                    if(res.data.status==200){
                        that.$Message.success("已收藏！");
                        that.star='md-star';
                        that.starText='已收藏';
                    }
                    else{
                        that.$Message.error(res.data.msg)
                    }
                }).catch((error)=>{
                    that.$Message.error(error.data.msg)
                });
            }
            else{
                that.$Message.error("必须选择一个收藏文件夹！")
            }
        },
        getLabels(){
            let that=this
            //博客标签获取
            this.$axios.post('/selectLabelByBlogId',{
                'blogId':that.blogId,
            }).then(function(res){
                if(res.data.status==200){
                    that.label=res.data.data
                    // console.log(that.label)
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