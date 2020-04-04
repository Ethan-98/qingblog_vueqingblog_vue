<template>
    <div>
        <Navigation></Navigation>
        <div class="registerPage">
            <Row>
                <Col span="6" offset="8">
                    <div style="width:100%;padding-top:50%">
                        <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
                            <FormItem label="Name" prop="name">
                                <Input v-model="formValidate.name" placeholder="Enter your username"></Input>
                            </FormItem>
                            <FormItem label="E-mail" prop="mail">
                                <Input v-model="formValidate.mail" placeholder="Enter your e-mail"></Input>
                            </FormItem>
                            <FormItem label="Tel" prop="tel">
                                <Input v-model="formValidate.tel" placeholder="Enter your tell"></Input>
                            </FormItem>
                            <FormItem label="Passwd" prop="pwd">
                                <Input v-model="formValidate.pwd" placeholder="Enter your pasword"></Input>
                            </FormItem>
                            <FormItem>
                                <Button type="primary" @click="handleSubmit('formValidate')">Submit</Button>
                                <Button @click="handleReset('formValidate')" style="margin-left: 8px">Reset</Button>
                            </FormItem>
                        </Form>
                    </div>
                </Col>
            </Row>
        </div>
    </div>
</template>

<script>
import Navigation from '@/components/Navigation.vue'
export default {
    data () {
        //自定义检验
        const validateTel = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('Please enter your password'));
                } 
                else if(value.length<8||value.length>16){
                    callback(new Error("Incorrect Tel length format"));
                }
                else {
                    // console.log(val);
                    var status=true;
                    var val;
                    for(val in value){
                        if(isNaN(val)){
                            status=false;
                        }
                    }
                    if(!status){
                        callback(new Error("Incorrect Tel format"))
                    }
                    callback();
                }
            };
            return {
                formValidate: {
                    name: '',
                    mail: '',
                    tel: '',
                    pwd: ''
                },
                ruleValidate: {
                    name: [
                        { required: true, message: 'The name cannot be empty', trigger: 'blur' }
                    ],
                    mail: [
                        { required: true, message: 'Mailbox cannot be empty', trigger: 'blur' },
                        { type: 'email', message: 'Incorrect email format', trigger: 'blur' }
                    ],
                    tel:[
                        { validator: validateTel, trigger: 'blur' }
                    ],
                    pwd:[
                        { required:true,message:'The password cannot be empty', trigger: 'blur'},
                        { type: 'string', min:8,max:16,message:'Incorrect password length',trigger: 'blur'}
                    ]
                    
                }
            }
        },
        methods: {
            handleSubmit (name) {
                let that=this;
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        that.$axios.post('userRegister',{
                            'userName':that.formValidate.name,
                            'userMail':that.formValidate.mail,
                            'userTel':that.formValidate.tel,
                            'userPassword':that.formValidate.pwd
                        }).then(function(res){
                            // console.log(response)
                            if(res.data.status==200){
                                that.$Message.success('修改成功，请登录！');
                                that.$router.push('/login');
                            }
                            else{
                                that.$Message.error(res.data.msg)
                            }
                        }).catch((error)=>{
                            that.$Message.error(error.data.msg)
                        });
                    } else {
                        this.$Message.error('Fail!');
                    }
                }).catch((error)=>{
                    that.$Message.error(error.data.msg)
                });
            },
            handleReset (name) {
                this.$refs[name].resetFields();
            }
        },
        components:{
            Navigation
        }
}
</script>

<style scoped>

</style>