package main;

import frame.Server;
import frame.http.HttpCusServer;

public class Http {

    public static void main(String[] args) {
        try {
            String user_dir = System.getProperty("user.dir");
            //
            frame.JarLoader.load(user_dir + "/libs");
            frame.JarLoader.addusr_paths(user_dir + "/libs");
            frame.ClassLoader.loadClassesFromPath();
            final HttpCusServer httpCusServer = new HttpCusServer(Server.port);//http服务 监听81端口
            httpCusServer.bootstrap();//启动
            //程序退出的清理工作
            Server.cleanShutdownHooks();
            Runtime.getRuntime().addShutdownHook(new Thread() {
                public void run() {
                    try {
                        httpCusServer.shutdown();
                    } catch (Throwable e) {
                        e.printStackTrace();
                    }
                }
            });
        } catch (Throwable e) {
            e.printStackTrace();
            System.exit(0);
        }
    }
}
