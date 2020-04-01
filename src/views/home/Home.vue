<template>
    <div>
        <header>
        <Navigation></Navigation>
        </header>
        <Row>
            <Col span="4">
                <br>
            </Col>
            <Col span="14">
                    <ABlog v-for="(item,index) in blogList" :key="index" :blog="item"></ABlog>
                    <Button @click="getBlogList()" type="primary" long>查看更多<Icon type="ios-arrow-down" /><Icon type="ios-arrow-down" /><Icon type="ios-arrow-down" /></Button>
                </Col>
            <Col span="6">
                <Row style="height:650px">
                    <br>
                </Row>
                <Row style="text-align:left;width:100%;padding-left:100px;position:fixed">
                    <Dropdown>
                        <a href="javascript:void(0)">
                            <Icon type="ios-add-circle-outline" color="blue" size="50"/>
                        </a>
                        <DropdownMenu slot="list">
                            <DropdownItem>
                                <a @click="editBlog()">写文章</a>
                            </DropdownItem>
                            <!-- <DropdownItem>炸酱面</DropdownItem>
                            <DropdownItem>豆汁儿</DropdownItem>
                            <DropdownItem>冰糖葫芦</DropdownItem>
                            <DropdownItem>北京烤鸭</DropdownItem> -->
                        </DropdownMenu>
                    </Dropdown>
                    <BackTop></BackTop>
                    <!-- <BackTop :height="80" :bottom="80">
                        <div class="top">
                            <Icon type="ios-arrow-dropup" />
                        </div>
                    </BackTop> -->
                </Row>
            </Col>
        </Row>
    </div>
</template>

<script>
import Navigation from '@/components/Navigation.vue'
import ABlog from '@/components/ABlog.vue'

export default {
    data(){
        return{
            //当前页面所有的blog
            blogList:[],
            //此次加载的blog
            blogs:[],
            //存储页数
            pageNo:1,
            pageSize:5,
            //返回值中包含的数目
            blogNum:0,
            blogCount:0
        }
    },
    components:{
        Navigation,
        ABlog
    },
    mounted(){
        this.init();
    },
    methods:{
        editBlog(){
            this.$router.push('/editBlog');
        },
        init(){
            this.getBlogList()
        },
        getBlogList(){
            var that=this;
            this.$axios.post('/viewAllBlogList',{
                'pageNo':that.pageNo,
                'pageSize':that.pageSize
            }).then(function(res){
                if(res.data.status==200){
                    // console.log("______________________")
                    // console.log(res.data)
                    that.blogs=res.data.data;
                    that.blogNum=res.data.data.length;
                    that.blogCount+=that.blogNum
                    // that.blogList.push(that.blogs);
                    let item;
                    for(item in that.blogs){
                        that.blogList.push(that.blogs[item]);
                    }
                    console.log(that.blogList)
                    that.pageNo+=1;
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
    .top{
        padding: 10px;
        background: rgba(0, 153, 229, .7);
        color: #2d8cf0;
        text-align: center;
        border-radius: 50px;
    }
</style>