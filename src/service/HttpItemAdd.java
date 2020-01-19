package service;

import frame.http.HttpCmd;
import org.json.JSONObject;
import utils.fileutils.FileOperate;

import java.io.File;

import static service.HttpConstant.*;

public class HttpItemAdd extends HttpCmd {

    //http接口需要继承 HttpCmd
    static {
        //注册接口
        HttpCmd.register("/search/" + ITEM_LIST_ADD, HttpItemAdd.class);
    }

    @Override
    public void execute() {  //接口业务逻辑处理方法
        //读取post请求json参数并创建JSONObject
        JSONObject params = getJSONObject();
        String fileContent = FileOperate.getInstance().readTxt(bookFilePath, "UTF-8");
        fileContent = removeEnd(fileContent, params.toString());
        FileOperate.getInstance().createFile(bookFilePath, fileContent);
        result.put("status", "200");
        result.put("msg", fileContent);
        // 创建当前类名内容列表
        File file = new File(typeItemFilePath);
        if (!file.exists()) {
            FileOperate.getInstance().createFile(typeItemFilePath, "{}");
        }
        String fileTypeContent = FileOperate.getInstance().readTxt(typeItemFilePath, "UTF-8");
        String newContent = "\"" + params.getString("name") + "\":[]";
        fileTypeContent = fileTypeContent.substring(0, fileTypeContent.length() - 2);
        if (fileTypeContent.length() < 2) {
            fileTypeContent += newContent + "}";
        } else {
            fileTypeContent += "," + newContent + "}";
        }
        FileOperate.getInstance().createFile(typeItemFilePath, fileTypeContent);
        result.put("itemList",fileTypeContent);
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
            fileContent += newContent + "]";
        } else {
            fileContent += "," + newContent + "]";
        }
        return fileContent;
    }
}
