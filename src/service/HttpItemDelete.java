package service;

import com.alibaba.fastjson.JSONArray;
import frame.http.HttpCmd;
import org.json.JSONObject;
import utils.fileutils.FileOperate;

import static service.HttpConstant.ITEM_LIST_DELETE;
import static service.HttpConstant.bookFilePath;

public class HttpItemDelete extends HttpCmd {

    //http接口需要继承 HttpCmd
    static {
        //注册接口
        HttpCmd.register("/search/" + ITEM_LIST_DELETE, HttpItemDelete.class);
    }

    @Override
    public void execute() {  //接口业务逻辑处理方法
        JSONObject params = getJSONObject();//读取post请求json参数并创建JSONObject
        String fileContent = FileOperate.getInstance().readTxt(bookFilePath, "UTF-8");
        String name = params.getString("name");
        JSONArray array = JSONArray.parseArray(fileContent);
        for (int i = 0; i < array.size(); i++) {
            if (name.equals(array.getJSONObject(i).getString("name"))) {
                array.remove(i);
            }
        }
        fileContent = array.toJSONString();
        FileOperate.getInstance().createFile(bookFilePath, fileContent);
        result.put("status", "200");
        response(result);  //响应请求
    }
}
