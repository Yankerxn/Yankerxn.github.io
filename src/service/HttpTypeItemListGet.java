package service;

import com.alibaba.fastjson.JSONArray;
import frame.http.HttpCmd;
import org.json.JSONObject;
import utils.fileutils.FileOperate;

import java.io.File;

import static service.HttpConstant.TYPE_ITEM_LIST;
import static service.HttpConstant.typeItemFilePath;

public class HttpTypeItemListGet extends HttpCmd {

    //http接口需要继承 HttpCmd
    static {
        //注册接口
        HttpCmd.register("/search/" + TYPE_ITEM_LIST, HttpTypeItemListGet.class);
    }

    @Override
    public void execute() {  //接口业务逻辑处理方法
        JSONObject params = getJSONObject();
        String nameID = params.getString("name");
        File file = new File(typeItemFilePath);
        if (!file.exists()) {
            FileOperate.getInstance().createFile(typeItemFilePath, "{}");
        }
        String msg = FileOperate.getInstance().readTxt(typeItemFilePath, "UTF-8");
        com.alibaba.fastjson.JSONObject object = com.alibaba.fastjson.JSONObject.parseObject(msg);
        String content = object.getString(nameID);
        if (content.equals("")){
            content = "[]";
        }
        result.put("msg", content);
        response(result);  //响应请求
    }
}
