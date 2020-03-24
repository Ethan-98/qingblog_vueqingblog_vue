<template>
    <div>
        <Navigation></Navigation>
        <div class="registerPage">
                <Row>
                    <Col span="6" offset="8">
                        <div style="width:100%;padding-top:50%">
                            <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
                                <FormItem label="Name" prop="name">
                                    <Input v-model="formValidate.name" :placeholder="namePH"></Input>
                                </FormItem>
                                <FormItem label="E-mail" prop="mail">
                                    <Input v-model="formValidate.mail" :placeholder="mailPH"></Input>
                                </FormItem>
                                <FormItem label="Tel" prop="tel">
                                    <Input v-model="formValidate.tel" :placeholder="telPH"></Input>
                                </FormItem>
                                <FormItem>
                                    <Button type="primary" @click="handleSubmit('formValidate')">Submit</Button>
                                    <Button @click="handleReset('formValidate')" style="margin-left: 8px">Reset</Button>
                                </FormItem>
                                <br/>
                                <FormItem>
                                    <Button type="primary" @click="updatePwd()">????</Button>
                                </FormItem>
                            </Form>
                        </div>
                    </Col>
                </Row>
            </div>
        </div>
    </div>
</template>

<script>
import Navigation from '@/components/Navigation.vue'
export default {
    data(){
        const validateTel = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('Please enter your Tel'));
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
                namePH:'',
                mailPH:'',
                telPH:'',
                formValidate: {
                    name: '',
                    mail: '',
                    tel: '',
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
                }
            }
    },
    mounted(){
        this.init();
    },
    components:{
        Navigation
    },
    methods:{
        init(){
            let that=this;
            this.$axios.get('/selectInfo').then(function (res) {
                // console.log(res)
                that.namePH=res.data.userName;
                that.mailPH=res.data.userMail;
                that.telPH=res.data.userTel;
            })
        },
        handleSubmit (name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        let that=this;
                        this.$axios.post('userUpdateInfo',{
                            'userName':that.formValidate.name,
                            'userMail':that.formValidate.mail,
                            'userTel':that.formValidate.tel,
                            // 'userPassword':that.formValidate.pwd
                        }).then(function(response){
                            // console.log(response)
                            // console.log(response.data)
                            if(response.data.status==200){
                                that.$Message.success('Success!');
                                that.$router.push('/');
                            }
                            else{
                                alert(response.data.msg);
                            }
                        }).catch((error)=>{
                            console.log(error)
                        })
                    } else {
                        this.$Message.error('Fail!');
                    }
                })
            },
            handleReset (name) {
                this.$refs[name].resetFields();
            },
            updatePwd(){
                this.$router.push('/alertPwd')
            }
    },
}
</script>

<style scoped>

</style>