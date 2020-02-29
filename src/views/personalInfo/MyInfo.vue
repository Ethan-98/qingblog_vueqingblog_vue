<template>
    <div>
        <header>
            <Navigation></Navigation>
        </header>
        <div>
            <Row style="width:100%">
                <Col span="5">
                <br>
                </Col>
                <Col span="14">
                    <div style="text-align:left">
                        <h1>个人资料</h1>
                    </div>
                    <Divider></Divider>
                    <Row>
                        <Col span="4">
                            <div>
                                <img id="profile" style="width:100px;height:100px;" v-bind:src="imgUrl"  alt="头像" />
                            </div>
                            <Upload action="//jsonplaceholder.typicode.com/posts/" :format="['jpg','png','jpeg']" :max-size="2048" :before-upload="handleUpload">
                                <Button icon="ios-cloud-upload-outline">更换头像</Button>
                            </Upload>
                        </Col>
                        <Col span="20">
                            <Row style="width:100%">
                                <Col span="12" style="text-align:left">
                                    <span>ID:{{text}}</span>
                                </Col>
                                <Col span="12" style="text-align:right">
                                    <a href="">个人主页 ></a>
                                </Col>
                                <br>
                            </Row>
                            <br>
                            <Row>
                                <Col span="6" style="text-align:left">
                                关注：{{text}}
                                </Col>
                                <Col span="6" style="text-align:left">
                                粉丝：{{text}}
                                </Col>
                            </Row>
                            <Divider>个人信息</Divider>
                            <Row>
                                <div>
                                    <div class="info">我的 ID ：{{user.userId}}</div>
                                    <div class="info">我的昵称 : {{user.userName}}</div>
                                    <div class="info">我的电话 : {{user.userTel}}</div>
                                    <div class="info">我的邮箱 ：{{user.userMail}}</div>
                                    <div class="info">注册时间 ：{{user.userRegisterDate.toString().substr(0,10)}}</div>
                                    <div class="info">账户状态 ：{{userState}}</div>
                                </div>
                            </Row>
                        </Col>
                    </Row>
                    <Row>
                        
                    </Row>
                </Col>
                <Col span="5">
                <br>
                </Col>
            </Row>
        </div>
    </div>
</template>

<script>
import Navigation from '@/components/Navigation.vue'
export default {
    data(){
        return{
            text:"test",
            user:{},
            userState:'',
            imgUrl:''
        }
    },
    components:{
        Navigation
    },
    mounted(){
        this.getUserInfo()
    },
    methods:{
        getUserInfo(){
            let that=this;
            this.$axios.get('/selectInfo').then(function (res) {
                console.log(res)
                that.user=res.data;
                if(that.user.userState==0){
                    that.userState='正常'
                }
                else if(that.user.userState==1){
                    that.userState='限制'
                }
                else if(that.user.userState==2){
                    that.userState='锁定'
                }
                else{
                    that.userState='注销'
                }
                if(that.user.userImage==''){
                    that.imgUrl='http://localhost:8080/qingblog/img?id=5e58d5dc0141020e17edf3e1';
                }
                else{
                    that.imgUrl='http://localhost:8080/qingblog/img?id='+that.user.userImage;
                }
            })
        },
        handleUpload(file){
            // console.log(file)
            var formdata = new FormData();
            formdata.append("file", file);
            this.$axios({
                url: "upLoadProfile",
                method: "post",
                processData: false,
                data: formdata,
                headers: { "Content-Type": "multipart/form-data" }
            }).then(res => {
                console.log(res);
            });
        }
    }
}
</script>

<style scoped>
    .info{
        text-align: left;
        line-height: 40px
    };
    /* #profile{
        width:100%;
        height:100px;
    } */
    
</style>