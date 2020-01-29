package service;

import com.alibaba.fastjson.JSONArray;
import frame.http.HttpCmd;
import org.json.JSONObject;
import utils.fileutils.FileOperate;

import static service.HttpConstant.TYPE_ITEM_LIST_DELETE;
import static service.HttpConstant.typeItemFilePath;

public class HttpTypeItemDelete extends HttpCmd {

    //http接口需要继承 HttpCmd
    static {
        //注册接口
        HttpCmd.register("/search/" + TYPE_ITEM_LIST_DELETE, HttpTypeItemDelete.class);
    }

    @Override
    public void execute() {  //接口业务逻辑处理方法
        JSONObject params = getJSONObject();//读取post请求json参数并创建JSONObject
        String fileContent = FileOperate.getInstance().readTxt(typeItemFilePath, "UTF-8");
        int index = Integer.parseInt(params.getString("index"));
        String nameID = params.getString("nameID");
        com.alibaba.fastjson.JSONObject object = com.alibaba.fastjson.JSONObject.parseObject(fileContent);
        JSONArray array = JSONArray.parseArray(object.getString(nameID));
        if (index < array.size()){
            array.remove(index);
            fileContent = array.toJSONString();
        }
        object.put(nameID,fileContent);
        fileContent = object.toJSONString();
        FileOperate.getInstance().createFile(typeItemFilePath, fileContent);
        result.put("status", "200");
        result.put("msg", fileContent);
        response(result);  //响应请求
    }

    /**
     * 去除尾部并添加新的数据
     *
     * @param fileContent 源数据
     * @param newContent  新增数据
     * @return 合并的数据
     */
    private String removeEnd(String fileContent, String newContent) {
        fileContent = fileContent.substring(0, fileContent.length() - 2);
        if (fileContent.length() < 2) {
            fileContent += "[" + newContent + "]";
        } else {
            fileContent += "}," + newContent + "]";
        }
        return fileContent;
    }
}
