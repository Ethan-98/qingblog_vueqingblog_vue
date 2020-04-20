<template>
    <div>
    <Menu mode="horizontal" :theme="theme1" active-name="1">
        <Row>
            <Col span="4" id="logoCol">
                <Row>
                    <Col span="10">
                        <img id="logo" src="../assets/icons/title.png">
                    </Col>
                    <Col span="14" class="navTxt">
                        Ethan's Blog
                    </Col>
                </Row>
            </Col>
            <Col span="4">
                <div @click="getHot()"  class="navTxt">
                    热点
                </div>
            </Col>
            <Col span="4">
                <div class="navTxt">
                    收藏
                </div>
            </Col>
            <Col span="4">
                <div class="navTxt">
                    消息
                </div>
            </Col>
            <Col span="4">
                <div class="navTxt">
                    <Dropdown placement="bottom-start" style="margin-left: 20px" @on-click="myInfo">
                        <a href="javascript:void(0)">
                        我的
                        <Icon type="ios-arrow-down"></Icon>
                        </a>
                        <DropdownMenu slot="list">
                            <DropdownItem name="personal">个人中心</DropdownItem>
                            <DropdownItem name="myBlog">我的创作</DropdownItem>
                            <DropdownItem name="alertInfo">信息更改</DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </div>
            </Col>
            <Col span="4" id="defaultCol">
                <Row>
                    <Col span="12">
                        <slot></slot>
                    </Col>
                    <img id="default" src="../assets/icons/default.png">
                </Row>
            </Col>
        </Row>
    </Menu>
    </div>
</template>
<script>
    export default {
        data () {
            return {
                theme1: 'dark'
            }
        },
        methods:{
            myInfo(name){
                // console.log(name)
                if (name == 'personal') {
                    this.$router.push('/myInfo')
                } else if (name == 'myBlog') {
                    console.log("alertInfo")
                } else {
                    this.$router.push('/alertInfo')
                }
            },
            getHot(){
                this.$router.push('/')
            }
        }
    }
</script>
<style scoped>
#logoCol{
    height:50px;
    text-align: left;
}
#defaultCol{
    height:50px;
    text-align: right;
}
#logo{
    height: 40px;
    width:40px;
    border-radius: 20px;
    margin: 5px;
    margin-left: 20px;
}
#default{
    height: 40px;
    width:40px;
    border-radius: 20px;
    margin: 5px;
    margin-right: 20px;
}
.navTxt{
    font-size: 20px;
    color: antiquewhite
}
</style>
