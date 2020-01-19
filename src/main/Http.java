package main;

import frame.Server;
import frame.http.HttpServer;

public class Http {

	public static void main(String[] args) {
		try {	
			String user_dir = System.getProperty("user.dir"); 
			//
			frame.JarLoader.load(user_dir + "/libs");
			frame.JarLoader.addusr_paths(user_dir + "/libs");
			frame.ClassLoader.loadClassesFromPath();
			final HttpServer httpserver = new HttpServer(81);//http服务 监听81端口
			httpserver.bootstrap();//启动
			//程序退出的清理工作
			Server.cleanShutdownHooks();
			Runtime.getRuntime().addShutdownHook(new Thread() {
				public void run() {
					try {
						httpserver.shutdown();
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
