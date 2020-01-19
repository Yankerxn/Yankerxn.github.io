package service;

import com.alibaba.fastjson.JSONArray;
import frame.http.HttpCmd;
import utils.fileutils.FileOperate;

import java.io.File;

import static service.HttpConstant.ITEM_LIST;
import static service.HttpConstant.bookFilePath;

public class HttpItemListGet extends HttpCmd {

    //http接口需要继承 HttpCmd
    static {
        //注册接口
        HttpCmd.register("/search/" + ITEM_LIST, HttpItemListGet.class);
    }

    @Override
    public void execute() {  //接口业务逻辑处理方法
        File file = new File(bookFilePath);
        if (!file.exists()) {
            FileOperate.getInstance().createFile(bookFilePath, "[]");
        }
        String msg = FileOperate.getInstance().readTxt(bookFilePath, "UTF-8");
        JSONArray array = JSONArray.parseArray(msg);
        // name作为下标使用
        if (array.size() == 0){
            result.put("msg", "[]");
            result.put("size", "0");
        }else {
            String name = array.getJSONObject(array.size() - 1).getString("name");
            int index = Integer.parseInt(name);
            result.put("msg", msg);
            result.put("size", String.valueOf(++index));
        }
        response(result);  //响应请求
    }
}
