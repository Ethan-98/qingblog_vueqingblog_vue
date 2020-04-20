<template>
    <div>
        <Navigation></Navigation>
        <div class="registerPage">
                <Row>
                    <Col span="6" offset="8">
                        <div style="width:100%;padding-top:50%">
                            <Form ref="formCustom" :model="formCustom" :rules="ruleCustom" :label-width="80">
                            <FormItem label="密码" prop="passwd">
                                <Input type="password" v-model="formCustom.passwd"></Input>
                            </FormItem>
                            <FormItem label="确认密码" prop="passwdCheck">
                                <Input type="password" v-model="formCustom.passwdCheck"></Input>
                            </FormItem>
                            <!-- <FormItem label="Age" prop="age">
                                <Input type="text" v-model="formCustom.age" number></Input>
                            </FormItem> -->
                            <FormItem>
                                <Button type="primary" @click="handleSubmit('formCustom')">提交</Button>
                                <Button @click="handleReset('formCustom')" style="margin-left: 8px">重置</Button>
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
        const validatePass = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('Please enter your password'));
                } else {
                    if (this.formCustom.passwdCheck !== '') {
                        // 对第二个密码框单独验证
                        this.$refs.formCustom.validateField('passwdCheck');
                    }
                    callback();
                }
            };
            const validatePassCheck = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('Please enter your password again'));
                } else if (value !== this.formCustom.passwd) {
                    callback(new Error('The two input passwords do not match!'));
                } else {
                    callback();
                }
            };
        return{
            formCustom: {
                    passwd: '',
                    passwdCheck: '',
                    // age: ''
                },
                ruleCustom: {
                    passwd: [
                        { validator: validatePass, trigger: 'blur' }
                    ],
                    passwdCheck: [
                        { validator: validatePassCheck, trigger: 'blur' }
                    ],
                    // age: [
                    //     { validator: validateAge, trigger: 'blur' }
                    // ]
                }
        }
    },
    components:{
        Navigation
    },
    methods: {    
        handleSubmit (name) {
            let that=this;
            this.$refs[name].validate((valid) => {
                if (valid) {
                    // console.log("PWD:" +this.formCustom.passwd)
                    let that=this;
                    this.$axios.post('userUpdatePwd',{
                        'userPassword':that.formCustom.passwd
                    }).then(function(res){
                        // console.log(res)
                        if(res.data.status==200){
                            // alert("修改成功");
                            that.$Message.success('Success!');
                            that.$router.push('/')
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
    }
}
</script>

<style scoped>

</style>