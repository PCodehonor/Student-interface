<?php
// ftp_upload.php
$ftp_server = "your ip";
$ftp_username = "111111";
$ftp_password = "000000";

// 获取上传的文件和文件夹信息
$file = $_FILES['file'];
$folder = $_POST['folder'];

// 连接FTP服务器
$conn_id = ftp_connect($ftp_server) or die("无法连接到FTP服务器");

// 登录
if (@ftp_login($conn_id, $ftp_username, $ftp_password)) {
    // 检查并创建文件夹
    if (!@ftp_chdir($conn_id, $folder)) {
        ftp_mkdir($conn_id, $folder);
    }
    
    // 上传文件
    $remote_file = $folder . "/" . basename($file['name']);
    if (ftp_put($conn_id, $remote_file, $file['tmp_name'], FTP_BINARY)) {
        echo "文件上传成功";
    } else {
        echo "文件上传失败";
    }
} else {
    echo "FTP登录失败";
}

// 关闭连接
ftp_close($conn_id);
?>