// 全局商品管理插件
export default ({ app }, inject) => {
  // 发布商品到后端
  inject('publishProduct', async (productData) => {
    const requestBody = {
      title: productData.title.trim(),
      price: parseFloat(productData.price),
      originalPrice: productData.originalPrice ? parseFloat(productData.originalPrice) : null,
      category: productData.category || 'others',
      description: productData.description || '',
      image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=400&fit=crop',
      tags: '新品',
      sellerId: 1,
      sellerName: '当前用户',
      sellerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
      location: '校本部',
      isNew: 1,
      isUrgent: 0
    };

    try {
      const res = await fetch('http://localhost:10010/product', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Token': localStorage.getItem('token') || ''
        },
        body: JSON.stringify(requestBody)
      });

      if (res.ok) {
        const result = await res.json();
        if (result.code === 20000) {
          // 发布成功，更新 localStorage
          const newProductItem = {
            ...requestBody,
            id: Date.now(),
            status: 'selling',
            views: 0
          };

          // 获取已发布的商品列表
          let published = [];
          const saved = localStorage.getItem('myPublished');
          if (saved) {
            published = JSON.parse(saved);
          }

          // 添加到列表开头
          published.unshift(newProductItem);

          // 保存到 localStorage
          localStorage.setItem('myPublished', JSON.stringify(published));

          return { success: true, data: newProductItem };
        }
      }
      return { success: false, message: '发布失败' };
    } catch (error) {
      console.error('发布商品失败:', error);
      return { success: false, message: error.message };
    }
  });
}
