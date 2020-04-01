<template>
    <div>
        <div class="container" id="loginPage">
            <Navigation></Navigation>
            <Form ref="formInline" :model="formInline" :rules="ruleInline" inline>
                <Row>
                    <Col span="14"><br/></Col>
                    <Col span="5" id="inputCol">
                        <div style="text-align:left;width:100%">
                            <FormItem prop="email" style="width:100%">
                                <Input class="inputBox" size="large" type="text" v-model="formInline.email" placeholder="Please Enter Email">
                                    <Icon type="ios-person-outline" slot="prepend"></Icon>
                                </Input>
                            </FormItem>
                            <br/>
                            <br/>
                            <FormItem prop="password" style="width:100%">
                                <Input class="inputBox" size="large" type="password" v-model="formInline.password" placeholder="Please Enter Password">
                                    <Icon type="ios-lock-outline" slot="prepend"></Icon>
                                </Input>
                            </FormItem>
                            <br/>
                            <br/>
                            <FormItem style="width:100%">
                                <Checkbox v-model="single" style="padding-left:10px">记住我</Checkbox>
                                <Button style="float:right;margin-right:10px" type="primary" @click="handleSubmit('formInline')">登录</Button>
                            </FormItem>
                            <FormItem style="width:100%;text-align:center">
                                <a @click="register()">没有账号，点击注册</a>
                            </FormItem>
                        </div>
                    </Col>
                    <Col span="7"><br/></Col>
                </Row>
            </Form>
        </div>
    </div>
</template>
<script>
    import Navigation from '@/components/Navigation.vue'
    export default {
        data () {
            return {
                single:false,
                formInline: {
                    email: '',
                    password: '',
                    single: 'false'
                },
                ruleInline: {
                    email: [
                        { required: true, message: 'Please fill in the email', trigger: 'blur' },
                        { type: 'email', message: 'Incorrect email format', trigger: 'blur' }
                    ],
                    password: [
                        { required: true, message: 'Please fill in the password.', trigger: 'blur' },
                        { type: 'string', min: 8,max:16,message: 'Incorrect password length', trigger: 'blur' }
                    ]
                }
            }
            
        },
        components:{
            Navigation
        },
        methods: {
            handleSubmit(name) {
                let that=this;
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        that.$axios.post('userLogin',{
                            "userMail":that.formInline.email,
                            "userPassword":that.formInline.password,
                        }).then(function (res) {
                            if(res.data.status==200){
                                // alert("登录成功！");
                                that.$router.push('/')
                            }
                            else{
                                that.$Message.error(res.data.msg)
                            }
                        }).catch((error)=>{
                            that.$Message.error(error.data.msg)
                        });
                        // this.$Message.success('Success!');
                    } else {
                        this.$Message.error('Fail!');
                    }
                }).catch((error)=>{
                    that.$Message.error(error.data.msg)
                });
            },
            register(){
                this.$router.push('/register')
            }
        }
    }
</script>
<style scoped>
#loginPage{
    background-color: aqua;
    width:100%;
    height:100%;
    background-image: '@/assets/images/background.jpg';
    background-size: 100%;
    
}
#inputCol{
    padding-top: 15%
}
.inputBox{
    width:100%;
}
</style>
