$(document).ready(function() {
    // 注销功能
    $('#logout-btn').on('click', function() { 
        window.location.href = 'login.html'; 
    });
    
    // 拖拽弹窗移动功能
    var isDrag = false, dx, dy;
    $('.upload-header').on('mousedown', function(e) { 
        isDrag = true; 
        var box = $('#upload-box'); 
        dx = e.clientX - box.offset().left; 
        dy = e.clientY - box.offset().top; 
        e.preventDefault(); 
    });
    
    $(document).on('mousemove', function(e) { 
        if(isDrag) { 
            $('#upload-box').css({
                left: e.clientX - dx, 
                top: e.clientY - dy, 
                transform: 'none'
            }); 
        }
    }).on('mouseup', function() { 
        isDrag = false; 
    });
    
    // 显示/隐藏弹窗功能
    function showModal() { 
        $('#upload-container').fadeIn(); 
        $('body').css('overflow', 'hidden'); 
        $('#upload-box').css({
            left: '50%', 
            top: '50%', 
            transform: 'translate(-50%, -50%)'
        }); 
    }
    
    function hideModal() { 
        $('#upload-container').fadeOut(); 
        $('body').css('overflow', 'auto'); 
        resetPreview(); 
    }
    
    function resetPreview() {
        $('#file-input').val('');
        $('#image-preview').hide().attr('src', '');
        $('#video-preview').hide().attr('src', '');
        $('.preview-placeholder').text('将文件拖拽到此处或点击"选择文件"').show();
    }
    
    // 上传按钮事件绑定
    $('#upload-btn, #upload-link, #floating-upload-btn, #upload-exp2, #upload-exp3, #upload-exp4').on('click', function(e) { 
        e.preventDefault(); 
        showModal(); 
    });
    
    $('#close-upload').on('click', hideModal);
    $('#upload-container').on('click', function(e) { 
        if(e.target === this) hideModal(); 
    });
    
    // 文件预览与拖拽上传功能
    function handleFile(file) { 
        if(!file) return; 
        $('.preview-placeholder').hide(); 
        $('#image-preview, #video-preview').hide(); 
        
        if(file.type.startsWith('image/')) { 
            var reader = new FileReader(); 
            reader.onload = function(e) { 
                $('#image-preview').attr('src', e.target.result).show(); 
            }; 
            reader.readAsDataURL(file); 
        } else if(file.type.startsWith('video/')) { 
            $('#video-preview').attr('src', URL.createObjectURL(file)).show(); 
        } else { 
            $('.preview-placeholder').text('请选择图片或视频文件').show(); 
        }
    }
    
    $('#file-input').on('change', function() { 
        handleFile(this.files[0]); 
    });
    
    $('#select-file-btn').on('click', function() { 
        $('#file-input').click(); 
    });
    
    // 拖拽上传功能
    $('#preview-container')
        .on('dragover', function(e) { 
            e.preventDefault(); 
            $(this).addClass('dragover'); 
        })
        .on('dragleave', function() { 
            $(this).removeClass('dragover'); 
        })
        .on('drop', function(e) { 
            e.preventDefault(); 
            $(this).removeClass('dragover'); 
            var file = e.originalEvent.dataTransfer.files[0]; 
            $('#file-input')[0].files = e.originalEvent.dataTransfer.files; 
            handleFile(file); 
        });
    
    // 文件上传功能
    $('#upload-file-btn').on('click', function() { 
        var fileInput = $('#file-input')[0]; 
        if(!fileInput.files.length) { 
            alert('请先选择文件'); 
            return; 
        } 
        
        var formData = new FormData(); 
        formData.append('file', fileInput.files[0]); 
        var now = new Date(); 
        formData.append('folder', now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate() + '-1234'); 
        
        var btn = $(this); 
        btn.html('<i class="fas fa-spinner fa-spin"></i> 上传中...').prop('disabled', true);
        
        $.ajax({ 
            url: 'ftp_upload.php', 
            type: 'POST', 
            data: formData, 
            processData: false, 
            contentType: false,
            success: function() { 
                alert('上传成功'); 
                hideModal(); 
                btn.html('上传文件').prop('disabled', false); 
            },
            error: function(_, __, err) { 
                alert('上传失败：' + err); 
                btn.html('上传文件').prop('disabled', false); 
            }
        }); 
    });
});