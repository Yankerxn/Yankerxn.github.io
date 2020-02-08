package service;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import frame.http.HttpCmd;
import utils.fileutils.FileOperate;

import java.io.File;

import static service.HttpConstant.*;

public class HttpCompleteItemListGet extends HttpCmd {

    //http接口需要继承 HttpCmd
    static {
        //注册接口
        HttpCmd.register("/search/" + COMPLETE_ITEM_LIST, HttpCompleteItemListGet.class);
    }

    @Override
    public void execute() {  //接口业务逻辑处理方法
        File file = new File(bookFilePath);
        if (!file.exists()) {
            FileOperate.getInstance().createFile(bookFilePath, "[]");
        }
        String fileContent = FileOperate.getInstance().readTxt(bookFilePath, "UTF-8");
        JSONArray arrayFirstTag = JSONArray.parseArray(fileContent);
        fileContent = FileOperate.getInstance().readTxt(typeItemFilePath, "UTF-8");
        JSONObject arraySecondTag = JSONObject.parseObject(fileContent);


//        [{"name":"3","title":"书本","content":"content"},{"name":"5","title":"年级","content":"content"}]

        response(result);  //响应请求
        
    }
}
